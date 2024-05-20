import { configureStore } from '@reduxjs/toolkit'
import devicesReducer from './features/devices/devicesSlice'
import portsReducer from './features/ports/portsSlice'
import { localStorageMiddleware } from './middleware/localStorage'

export const makeStore = () => configureStore({
  reducer: {
    devices: devicesReducer,
    ports: portsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware)
})

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']