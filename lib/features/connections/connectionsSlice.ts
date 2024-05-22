import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createAction, createDraftSafeSelector, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { Connection, ConnectionAddress, ConnectionPayload } from './connectionTypes'
import { reHydrate } from '@/lib/middleware/localStorage'
import { AudioPortSubTypes, Port, PortDirectionality, PortTypes } from '../ports/portTypes'

const NAMESPACE = 'connections'
type ConnectionsState = RootState['connections']


export const connectionsAdapter = createEntityAdapter<Connection>()

const { 
  selectById,
  selectAll,
} = connectionsAdapter.getSelectors()

const canConnect = createDraftSafeSelector([(state: ConnectionsState) => state, (state, connectionPayload: ConnectionPayload) => connectionPayload], (connectionsState, { input , output }) => {
  const connections = selectAll(connectionsState)
  const inputMax = input.type === PortTypes.AUDIO && input.subType === AudioPortSubTypes.STEREO ? 2 : 1
  const outputMax = output.type === PortTypes.AUDIO && output.subType === AudioPortSubTypes.STEREO ? 2 : 1
  let inputCount = 1
  let outputCount = 1
  connections.forEach(c => {
    if(c.input === input.id) inputCount++
    if(c.output === output.id) outputCount++
  })
  return inputCount <= inputMax && outputCount <= outputMax
})



export const connectionsSlice = createSlice({
  name: NAMESPACE,
  initialState: connectionsAdapter.getInitialState(),
  reducers: {
    toggle: (state, action: PayloadAction<ConnectionPayload>) => {
      const connection = connectionPayloadToConnection(action.payload)
      if(selectById(state, connection.id)) {
        connectionsAdapter.removeOne(state, connection.id)
      } else if(isConnectionCompatible(action.payload) && canConnect(state, action.payload)) {
        connectionsAdapter.addOne(state, connection)
      }
    },
    
  },
  extraReducers: (builder) => {
    builder.addCase(reHydrate, (state, action) => {
      if(action.payload) {
        return action.payload.connections
      } else {
        return state
      }
    })
  }
})
export default connectionsSlice.reducer



// Actions
export const toggle = connectionsSlice.actions.toggle



// Selectors
export const {
  selectAll: getConnections,
} = connectionsAdapter.getSelectors((state: RootState) => state[NAMESPACE])




// Helpers
export const deriveConnectionId = ({ output, input }: ConnectionPayload | ConnectionAddress) => {
  const inputId = typeof input === 'string' ? input : input.id
  const outputId = typeof output === 'string' ? output : output.id
  return `${outputId}-${inputId}`
}

const connectionValidators = {
  [PortTypes.AUDIO]: (input: Port, output: Port) => {
    return  input.type === PortTypes.AUDIO &&
    output.type === PortTypes.AUDIO &&
    input.io === PortDirectionality.INPUT && 
    output.io === PortDirectionality.OUTPUT
  },
  [PortTypes.MIDI]: (input: Port, output: Port) => {
    return  input.type === PortTypes.MIDI &&
    output.type === PortTypes.MIDI &&
    input.io === PortDirectionality.INPUT && 
    output.io === PortDirectionality.OUTPUT
  },
  [PortTypes.USB]: (input: Port, output: Port) => {
    return  input.type === PortTypes.USB &&
    output.type === PortTypes.USB &&
    input.host === true && 
    output.host === false
  },
}

export function isConnectionCompatible({ input, output }: ConnectionPayload) {
  return connectionValidators[output.type](input, output)
}

function connectionPayloadToConnection(connectionPayload: ConnectionPayload): Connection {
  return {
    id: deriveConnectionId(connectionPayload),
    input: connectionPayload.input.id,
    output: connectionPayload.output.id,
  }
}
