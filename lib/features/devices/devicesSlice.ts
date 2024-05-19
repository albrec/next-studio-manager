import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { Device, DevicePayload } from './deviceTypes'
import { PortPayload } from '../ports/portTypes'

const NAMESPACE = 'devices'


export const devicesAdapter = createEntityAdapter<Device>({
  // Assume IDs are stored in a field other than `device.id`
  // selectId: (device: Device) => device.id,
  // Keep the "all IDs" array sorted based on device names
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const {
  selectById,
  selectAll,
  selectIds,
  selectTotal
} = devicesAdapter.getSelectors((state: RootState) => state[NAMESPACE])


export const devicesSlice = createSlice({
  name: NAMESPACE,
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: devicesAdapter.getInitialState(),
  reducers: {
    load: (state, action) => {
      devicesAdapter.setAll(state, action.payload)
    },
    upsert: {
      prepare: (device: DevicePayload) => {
        return {
          payload: {
            ...device,
            id: device.id || uuidv4()
          } as Device
        }
      },
      reducer: (state, action: PayloadAction<Device>) => {
        devicesAdapter.upsertOne(state, action.payload)
      }
    },
    remove: devicesAdapter.removeOne,
    addPort: {
      prepare: (deviceId: Device['id'], port: PortPayload) => {
        console.log('prepare', deviceId, port)
        return {
          payload: {
            ...port,
            deviceId,
          }
        }
      },
      reducer: (state, action: PayloadAction<PortPayload & { deviceId: Device['id'] }>) => {
        console.log('addPort from deviceSlices', action)
      }
    },
  }
})
export default devicesSlice.reducer


// Reducers
export const { load, upsert, remove, addPort } = devicesSlice.actions


// Selectors
// export const { selectById: get, selectAll: getAll, selectIds: getIds, selectTotal: getCount } = devicesAdapter.getSelectors((state: RootState) => state[NAMESPACE])
export const getDevice = selectById
export const getDevices = selectAll
export const getDeviceIds = selectIds
export const getDeviceCount = selectTotal
