import { COLORS } from "@/app/constants"

export const MidiChannelNumbers: number[] = [...Array(16).keys()].map(i => i + 1)

export interface MidiChannelPayload {
  id?: string,
  channel: number,
  name: string,
  color?: string,
}

export interface MidiChannel extends MidiChannelPayload {
  id: string,
}

export const MidiChannelColors = COLORS