import { Port } from "../ports/portTypes"

type DeviceId = string

export interface DevicePayload {
  id?: DeviceId,
  name: string,
  midiChannels?: number[],
  portIds: Port['id'][]
}

export interface Device extends DevicePayload {
  id: DeviceId
}

export type Devices = Device[]