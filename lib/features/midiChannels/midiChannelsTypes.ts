export const MidiChannelNumbers: number[] = [...Array(16).keys()].map(i => i + 1)

export interface MidiChannelPayload {
  id?: string,
  channel: number,
  name: string,
}

export interface MidiChannel extends MidiChannelPayload {
  id: string,
}