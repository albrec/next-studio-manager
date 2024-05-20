import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { Connection, ConnectionPayload } from './connectionTypes'
import { reHydrate } from '@/lib/middleware/localStorage'
import { Port, PortDirectionality, PortTypes } from '../ports/portTypes'

const NAMESPACE = 'connections'


export const connectionsAdapter = createEntityAdapter<Connection>()

const { 
  selectById,
} = connectionsAdapter.getSelectors()

export const connectionsSlice = createSlice({
  name: NAMESPACE,
  initialState: connectionsAdapter.getInitialState(),
  reducers: {
    toggle: (state, action: PayloadAction<ConnectionPayload>) => {
      const derivedId = deriveConnectionId(action.payload)
      if(selectById(state, derivedId)) {
        removeOne(state, derivedId)
      } else {
        addOne(state, {
          ...action.payload,
          id: derivedId,
        })
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
const {
  addOne,
  removeOne,
} = connectionsAdapter
export const toggle = connectionsSlice.actions.toggle



// Selectors
export const {
  selectAll: getConnections,
} = connectionsAdapter.getSelectors((state: RootState) => state[NAMESPACE])



// Helpers
export const deriveConnectionId = ({ output, input }: ConnectionPayload) => {
  return `${output.id}-${input.id}`
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