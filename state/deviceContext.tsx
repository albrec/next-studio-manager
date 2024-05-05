import { createContext, useContext, useReducer } from 'react';

export interface Device {
  id: number,
  name: string,
}

const initialDevices: Array<Device> = [];

const DevicesContext = createContext(initialDevices);

const DevicesDispatchContext = createContext(null);

export function DevicesProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const [devices, dispatch] = useReducer(
    devicesReducer,
    initialDevices
  );

  return (
    <DevicesContext.Provider value={ devices }>
      <DevicesDispatchContext.Provider value={ dispatch }>
        {children}
      </DevicesDispatchContext.Provider>
    </DevicesContext.Provider>
  );
}

export function useDevices() {
  return useContext(DevicesContext);
}

export function useDevicesDispatch() {
  return useContext(DevicesDispatchContext);
}

function devicesReducer(devices: Array<Device>, action) {
  switch (action.type) {
    case 'add': {
      return [...devices, {
        id: action.id,
        name: action.name,
      }];
    }
    case 'change': {
      return devices.map(d => {
        if (d.id === action.device.id) {
          return action.device;
        } else {
          return d;
        }
      });
    }
    case 'delete': {
      return devices.filter(d => d.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
