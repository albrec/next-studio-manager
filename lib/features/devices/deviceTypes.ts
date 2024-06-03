import { COLORS } from "@/app/constants"
import { Port } from "../ports/portTypes"

type DeviceId = string

export interface DevicePayload {
  id?: DeviceId,
  name: string,
  color?: string,
  labelColor?: string,
  midiChannels?: number[],
  portIds: Port['id'][],
  midiRouter: boolean,
  audioRouter: boolean,
}

export interface Device extends DevicePayload {
  id: DeviceId,
}

export interface DeviceDecorated extends Device {
  inputs: Port[],
  outputs: Port[],
}

export type Devices = Device[]

export const DeviceColors = COLORS