import { Dispatch, createContext, useContext, useReducer } from 'react';
import type { Device } from './descriptions';

const DevicesContext = createContext<Device[] | null>(null);
const DevicesDispatchContext = createContext<Dispatch<DeviceActions> | null>(null);

export function useDevices() {
  return useContext(DevicesContext);
}

export function useDevicesDispatch() {
  return useContext(DevicesDispatchContext);
}


export function DevicesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [devices, dispatch] = useReducer( devicesReducer, [] );
  
  return (
    <DevicesContext.Provider value={ devices }>
      <DevicesDispatchContext.Provider value={ dispatch }>
        {children}
      </DevicesDispatchContext.Provider>
    </DevicesContext.Provider>
  );
}


type AddDevice = { type: 'add', device: Device }
type UpdateDevice = { type: 'update', device: Device }
type DeleteDevice = { type: 'delete', id: string }
type DeviceActions = AddDevice | UpdateDevice | DeleteDevice

function devicesReducer(devices: Device[], action: DeviceActions): Device[] {
  switch (action.type) {
    case 'add': {
      return [...devices, action.device];
    }
    case 'update': {
      return devices.map(d => {
        if (action.device?.id && d.id === action.device.id) {
          return action.device;
        } else {
          return d;
        }
      });
    }
    case 'delete': {
      return devices.filter(d => d.id !== action.id);
    }
  }
}
