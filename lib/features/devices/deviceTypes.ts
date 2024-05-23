import { COLORS } from "@/app/constants"
import { Port } from "../ports/portTypes"

type DeviceId = string

export interface DevicePayload {
  id?: DeviceId,
  name: string,
  color?: string,
  midiChannels?: number[],
  portIds: Port['id'][],
}

export interface Device extends DevicePayload {
  id: DeviceId,
}

export type Devices = Device[]

export const DeviceColors = COLORS