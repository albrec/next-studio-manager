import { Dispatch, createContext, useContext, useReducer } from 'react';
import type { Device, Port } from './descriptions';

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
type AddPort = { type: 'addPort', id: string, port: Port }
type UpdatePort = { type: 'updatePort', id: string, port: Port }
type DeletePort = { type: 'deletePort', id: string, portId: string }
type DeviceActions = AddDevice | UpdateDevice | DeleteDevice | AddPort | UpdatePort | DeletePort

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
    case 'addPort': {
      return devices.map(d => {
        if(d.id === action.id) {
          return {
            ...d,
            ports: d.ports.concat(action.port)
          }
        } else {
          return d
        }
      })
    }
    case 'updatePort': {
      return devices.map(d => {
        if(d.id === action.id) {
          d.ports.map(p => {
            if(p.id === action.id) {
              return action.port
            } else {
              return p
            }
          })
        }
        return d
      })
    }
    case 'deletePort': {
      return devices.map(d => {
        if(d.id === action.id) {
          d.ports = d.ports.filter(p => p.id !== action.portId)
        }
        return d
      })
    }
  }
}
