import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, combineReducers, createAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { Port, PortPayload } from './portTypes'
import { Device } from '../devices/deviceTypes'
import { devicesAdapter, getDevice, getDeviceIds, selectById as selectDeviceById } from '../devices/devicesSlice'

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
    upsert: {
      prepare: (port: PortPayload) => {
        return {
          payload: {
            ...port,
            id: port.id || uuidv4()
          } as Port
        }
      },
      reducer: (state, action: PayloadAction<Port>) => {
        portsAdapter.upsertOne(state, action.payload)
      }
    },
    remove: portsAdapter.removeOne,
    addPort: (state, action: PayloadAction<{ deviceId: Device['id'], port: Port}>) => {
      portsAdapter.addOne(state, action.payload.port)
    }
  }
})
export default portsSlice.reducer

// Actions
export const { load, upsert, remove } = portsSlice.actions
export const addPort = createAction(`${NAMESPACE}/addPort`, (deviceId: Device['id'], port: PortPayload) => {
  return {
    payload: {
      port: {
        ...port,
        id: uuidv4(),
      },
      deviceId,
    }
  }
})


// Selectors
export const getPort = selectById
export const getPorts = selectAll
export const getIds = selectIds
export const getPortCount = selectTotal
export const getPortsByDevice = (deviceId: Device['id']) => (state: RootState) => {
  return getDevice(state, deviceId).portIds.map(pid => selectById(state, pid))
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