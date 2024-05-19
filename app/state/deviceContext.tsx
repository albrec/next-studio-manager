'use client'

import { Dispatch, createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { Device, Port } from './descriptions'

const DevicesContext = createContext<Device[] | null>(null)
const DevicesDispatchContext = createContext<Dispatch<DeviceActions> | null>(null)

const DEVICE_KEY = 'devices'

export function useDevices() {
  return useContext(DevicesContext)
}

export function useDevicesDispatch() {
  return useContext(DevicesDispatchContext)
}


/**
 * The `DevicesProvider` function is a React component that provides device data and dispatch
 * functionality to its children using context.
 * @param  - The `DevicesProvider` component is a React component that uses the `useReducer` hook to
 * manage state for a list of devices. It creates a context provider with two contexts:
 * `DevicesContext` and `DevicesDispatchContext`. The `devices` state is managed by the
 * `devicesReducer` function
 * @returns The `DevicesProvider` component is returning the `children` wrapped inside
 * `DevicesContext.Provider` and `DevicesDispatchContext.Provider`, providing the `devices` state and
 * `dispatch` function to its children components.
 */
export function DevicesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loaded, setLoaded] = useState(false)
  const [devices, dispatch] = useReducer(devicesReducer, initialState)

  useEffect(() => {
    if(!loaded) {
      dispatch({ type: 'load', devices: getPersistedDevices() })
      setLoaded(true)
    }
  }, [loaded])
  
  useEffect(() => {
    if(loaded) {
      localStorage?.setItem(DEVICE_KEY, JSON.stringify(devices))
    }
  }, [devices, loaded])

  return (
    <DevicesContext.Provider value={ devices }>
      <DevicesDispatchContext.Provider value={ dispatch }>
        {children}
      </DevicesDispatchContext.Provider>
    </DevicesContext.Provider>
  )
}

const initialState: Device[] = []

function getPersistedDevices(initData = initialState) {
  let deviceData
  if (typeof localStorage === 'object') {
    const rawData = localStorage.getItem(DEVICE_KEY)
    deviceData = rawData ? JSON.parse(rawData) : initData
  }
  return deviceData || initData
}


/**
 * The above type defines various actions that can be performed on devices and ports in a TypeScript
 * React application.
 * @property type - The `type` property in the code snippet you provided is used to differentiate
 * between different types of actions that can be performed on devices and ports. It is a string
 * literal type that specifies the specific action being taken, such as adding a device, updating a
 * device, deleting a device, adding a port
 * @property {Device} device - The `device` property refers to an object of type `Device`. It is used
 * in the `AddDevice` and `UpdateDevice` actions to add or update a device in a system.
 */
type LoadDevices = { type: 'load', devices: Device[] }
type AddDevice = { type: 'add', device: Device }
type UpdateDevice = { type: 'update', device: Device }
type DeleteDevice = { type: 'delete', id: string }
type AddPort = { type: 'addPort', id: string, port: Port }
type UpdatePort = { type: 'updatePort', id: string, port: Port }
type DeletePort = { type: 'deletePort', id: string, portId: string }
type DeviceActions = LoadDevices | AddDevice | UpdateDevice | DeleteDevice | AddPort | UpdatePort | DeletePort


/**
 * The function `devicesReducer` is a reducer function in TypeScript React that handles various actions
 * such as adding, updating, and deleting devices and ports in a device list.
 * @param {Device[]} devices - The `devices` parameter in the `devicesReducer` function is an array of
 * `Device` objects. Each `Device` object represents a device with properties like `id`, `name`, and
 * `ports`. The reducer function takes this array of devices and performs different actions based on
 * the `DeviceActions
 * @param {DeviceActions} action - The `action` parameter in the `devicesReducer` function represents
 * an object that contains information about the action being dispatched. It has a `type` property that
 * specifies the type of action being performed, such as 'add', 'update', 'delete', 'addPort',
 * 'updatePort', or
 * @returns The `devicesReducer` function returns an updated array of devices based on the action type
 * provided. The function handles actions such as adding a device, updating a device, deleting a
 * device, adding a port to a device, updating a port on a device, and deleting a port from a device.
 * The function returns the updated array of devices after applying the corresponding action.
 */
function devicesReducer(devices: Device[], action: DeviceActions): Device[] {
  switch (action.type) {
  case 'load': {
    return action.devices
  }
  case 'add': {
    return [...devices, action.device]
  }
  case 'update': {
    return devices.map(d => {
      if (action.device?.id && d.id === action.device.id) {
        return action.device
      } else {
        return d
      }
    })
  }
  case 'delete': {
    return devices.filter(d => d.id !== action.id)
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
        d.ports = d.ports.map(p => {
          if(p.id === action.port.id) {
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
