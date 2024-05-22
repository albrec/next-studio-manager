import { v4 as uuidv4 } from 'uuid'
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { Device, DevicePayload } from './deviceTypes'
import { PortPayload, PortTypes } from '../ports/portTypes'
import { addPort, getPorts, portsAdapter, getEntities as getPortEntities, remove as removePort, sortInputOutputLists } from '../ports/portsSlice'
import { reHydrate } from '@/lib/middleware/localStorage'
import { PortableWifiOff } from '@mui/icons-material'

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
            portIds: device.portIds || [],
            id: device.id || uuidv4(),
          } as Device
        }
      },
      reducer: (state, action: PayloadAction<Device>) => {
        devicesAdapter.upsertOne(state, action.payload)
      }
    },
    remove: devicesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(reHydrate, (state, action) => {
      if(action.payload) {
        return action.payload.devices
      } else {
        return state
      }
    })
    builder.addCase(addPort, (state, action) => {
      state.entities[action.payload.deviceId].portIds.push(action.payload.port.id)
    })
    builder.addCase(removePort, (state, action) => {
      state.ids.forEach(id => {
        state.entities[id].portIds = state.entities[id].portIds.filter(i => i !== action.payload)
      })
    })
  }
})
export default devicesSlice.reducer


// Reducers
export const { load, upsert, remove } = devicesSlice.actions


// Selectors
export const getDevice = selectById
export const getDevices = selectAll
export const getDeviceIds = selectIds
export const getDeviceCount = selectTotal
export const getDecoratedDevices = (portFilters: PortTypes[]) => (state: RootState) => {
  const devices = getDevices(state)
  const portsEntities = getPortEntities(state)
  return devices.map(d => {
    const ports = d.portIds.map(id => portsEntities[id]).filter(p => portFilters.includes(p.type))
    return {
      ...d,
      ...sortInputOutputLists(ports),
    }
  })
}