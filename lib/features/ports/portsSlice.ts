import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, combineReducers, createAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { AudioPortSubTypes, DecoratedPort, Port, PortDirectionality, PortPayload, PortTypes } from './portTypes'
import { Device } from '../devices/deviceTypes'
import { getDevice, getDeviceByPortId, remove as removeDevice } from '../devices/devicesSlice'
import { reHydrate } from '@/lib/middleware/localStorage'
import { getConnections } from '../connections/connectionsSlice'

const NAMESPACE = 'ports'


export const portsAdapter = createEntityAdapter<Port>({
  sortComparer: sortPorts,
})

const { 
  selectById,
  selectEntities,
  selectAll,
  selectIds,
  selectTotal
} = portsAdapter.getSelectors((state: RootState) => state[NAMESPACE])

export const portsSlice = createSlice({
  name: NAMESPACE,
  initialState: portsAdapter.getInitialState(),
  reducers: {
    load: (state, action) => {
      portsAdapter.setAll(state, action.payload)
    },
    upsert: (state, action: PayloadAction<Port>) => {
      portsAdapter.upsertOne(state, action.payload)
    },
    update: portsAdapter.updateOne,
    remove: portsAdapter.removeOne,
    addPort: (state, action: PayloadAction<{ deviceId: Device['id'], port: Port}>) => {
      portsAdapter.addOne(state, action.payload.port)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reHydrate, (state, action) => {
      if(action.payload) {
        return action.payload.ports
      } else {
        return state
      }
    })
    builder.addCase(removeDevice, (state, action) => {
      console.log('portSlice responding to remove device')
      Object.values(state.entities).forEach(port => {
        if(port.deviceId === action.payload) {
          portsAdapter.removeOne(state, port.id)
        }
      })
    })
  }
})
export default portsSlice.reducer

// Actions
export const { load, upsert, update, remove } = portsSlice.actions
export const addPort = createAction(`${NAMESPACE}/addPort`, (deviceId: Device['id'], port: PortPayload) => {
  return {
    payload: {
      port: {
        ...port,
        id: uuidv4(),
        deviceId,
      },
      deviceId,
    }
  }
})


// Selectors
export const {
  selectAll: getPortsLocal,
  selectById: getPortLocal,
} = portsAdapter.getSelectors()
export const getPort = selectById
export const getPorts = selectAll
export const getIds = selectIds
export const getEntities = selectEntities
export const getPortCount = selectTotal

export const getPortsByDevice = (deviceId: Device['id']) => createSelector(getPorts, (ports: Port[]) => {
  return ports.filter(p => p.deviceId === deviceId)
})

export const getAllPortsByDevice = createSelector(getPorts, (ports: Port[]) => {
  return ports.reduce<{ [key: Device['id']]: Port[] }>((acc, port) => {
    const deviceId = port.deviceId
    if(!acc[deviceId]) {
      acc[deviceId] = []
    }
    acc[deviceId].push(port)
    return acc
  }, {})
})

export const getConnectedPorts = (portIds: Port['id'][]) => (state: RootState) => {
  return portIds.map(p => getConnectedPort(p)(state))
}

export const getConnectedPort = (portId: Port['id']) => (state: RootState) => {
  const connection = getConnections(state).find(c => c.input === portId || c.output === portId)
  if(connection) {
    const otherPortId = connection.input === portId ? connection.output : connection.input
    return getPort(state, otherPortId)
  }
}

export const getDecoratedPort = (portId: Port['id']) => (state: RootState): DecoratedPort => {
  const port = getPort(state, portId)
  const connectedPort = getConnectedPort(portId)(state)
  let connectedDevice
  if(connectedPort) {
    connectedDevice = getDeviceByPortId(connectedPort.id)(state)
  }
  
  return {
    ...port,
    connectedPort,
    connectedDevice,
  }
}



// Helpers
export function sortPorts(a: Port, b: Port) {
  const matcher = /(.+?)(\d+)$/
  const aSegments = a.name.match(matcher)
  const aName = aSegments?.[1] || ''
  const aNumber = parseInt(aSegments?.[2] || '')
  const bSegments = b.name.match(matcher)
  const bName = bSegments?.[1] || ''
  const bNumber = parseInt(bSegments?.[2] || '')
  return a.type.localeCompare(b.type) || aName.localeCompare(bName) || aNumber - bNumber
}

export function sortInputOutputLists<P extends Port>(ports: P[], { bidirectionalNormalized = true } = {}): { inputs: P[], outputs: P[] } {
  const isInput = (p: P) => {
    if(bidirectionalNormalized) {
      return p.io === PortDirectionality.INPUT || (p.type === PortTypes.USB && p.host)
    } else {
      return p.io === PortDirectionality.INPUT || p.io === PortDirectionality.BIDIRECTIONAL
    }
  }

  const isOutput = (p: P) => {
    if(bidirectionalNormalized) {
      return p.io === PortDirectionality.OUTPUT || (p.type === PortTypes.USB && !p.host)
    } else {
      return p.io === PortDirectionality.OUTPUT || p.io === PortDirectionality.BIDIRECTIONAL
    }
  }

  return {
    inputs: ports.filter(isInput).sort(sortPorts),
    outputs: ports.filter(isOutput).sort(sortPorts),
  }
}

export function isStereo(port: Port) {
  return port.type === PortTypes.AUDIO && port.subType === AudioPortSubTypes.STEREO
}