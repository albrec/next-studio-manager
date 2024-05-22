export const MidiChannelNumbers: number[] = [...Array(16).keys()].map(i => i + 1)

export type MidiChannel = {
  id: string,
  channel: number,
  name: string,
}