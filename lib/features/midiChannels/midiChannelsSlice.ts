import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createAction, createDraftSafeSelector, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { reHydrate } from '@/lib/middleware/localStorage'
import { AudioPortSubTypes, Port, PortDirectionality, PortTypes } from '../ports/portTypes'
import { MidiChannel } from './midiChannelsTypes'

const NAMESPACE = 'midiChannels'
type ConnectionsState = RootState['midiChannels']


export const midiChannelsAdapter = createEntityAdapter<MidiChannel>()

const { 
  selectById,
  selectAll,
} = midiChannelsAdapter.getSelectors()


export const midiChannelsSlice = createSlice({
  name: NAMESPACE,
  initialState: midiChannelsAdapter.getInitialState(),
  reducers: {
    add: midiChannelsAdapter.addOne,
    update: midiChannelsAdapter.updateOne,
    remove: midiChannelsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(reHydrate, (state, action) => {
      if(action.payload) {
        return action.payload.midiChannels
      } else {
        return state
      }
    })
  }
})
export default midiChannelsSlice.reducer



// Actions
export const {
  add,
  update,
  remove,
} = midiChannelsSlice.actions



// Selectors
export const {
  selectAll: getMidiChannels,
  selectById: getMidiChannel,
} = midiChannelsAdapter.getSelectors((state: RootState) => state[NAMESPACE])



// Helpers

