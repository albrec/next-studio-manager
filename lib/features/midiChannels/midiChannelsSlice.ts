import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createAction, createDraftSafeSelector, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { reHydrate } from '@/lib/middleware/localStorage'
import { AudioPortSubTypes, Port, PortDirectionality, PortTypes } from '../ports/portTypes'
import { MidiChannel, MidiChannelPayload } from './midiChannelsTypes'

const NAMESPACE = 'midiChannels'
type ConnectionsState = RootState['midiChannels']


export const midiChannelsAdapter = createEntityAdapter<MidiChannel>()

const { 
  selectById,
  selectAll,
} = midiChannelsAdapter.getSelectors()


export const update = createAction(`${NAMESPACE}/update`, (channel: MidiChannelPayload) => {
  return {
    payload: {
      ...channel,
      id: channel.channel.toString(),
    }
  }
})

export const midiChannelsSlice = createSlice({
  name: NAMESPACE,
  initialState: midiChannelsAdapter.getInitialState(),
  reducers: {
    update: (state, action) => {
      const channel = Object.values(state.entities).find(c => c.channel === action.payload.channel)
      if(action.payload.name) {
        midiChannelsAdapter.upsertOne(state, action.payload)
      } else if(channel) {
        midiChannelsAdapter.removeOne(state, channel.id)
      }
    },
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
// export const {
//   update,
// } = midiChannelsSlice.actions



// Selectors
export const {
  selectAll: getMidiChannels,
} = midiChannelsAdapter.getSelectors((state: RootState) => state[NAMESPACE])

export const getMidiChannel = (channel: number) => (state: RootState) => {
  const channels = getMidiChannels(state)
  return channels.find(c => c.channel === channel)
}



// Helpers

