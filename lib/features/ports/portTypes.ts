type PortId = string

interface PortBase {
  name: string,
  id?: PortId,
}

export interface AudioPortPayload extends PortBase {
  type: PortTypes.AUDIO,
  subType: AudioPortSubTypes,
  connector: AudioConnectors,
  io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface MidiPortPayload extends PortBase {
  type: PortTypes.MIDI,
  connector: MidiConnectors,
  io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface UsbPortPayload extends PortBase {
  type: PortTypes.USB,
  host: boolean,
  connector: UsbConnectors,
  io: PortDirectionality.BIDIRECTIONAL,
}

export interface AudioPort extends AudioPortPayload {
  id: PortId
}

export interface MidiPort extends MidiPortPayload {
  id: PortId
}

export interface UsbPort extends UsbPortPayload {
  id: PortId
}

export type Port = AudioPort | MidiPort | UsbPort
export type PortPayload = AudioPortPayload | MidiPortPayload | UsbPortPayload



// Enums and property types
export enum PortTypes {
  AUDIO = 'AUDIO',
  MIDI = 'MIDI',
  USB = 'USB',
}

export enum AudioPortSubTypes {
  BALANCED = 'BALANCED',
  UNBALANCED = 'UNBALANCE',
  STEREO = 'STEREO',
}

export enum PortConnectors {
  TRS = 'TRS',
  TR = 'TR',
  MINI_TRS = 'MINI_TRS',
  MINI_TS = 'MINI_TS',
  USB_A = 'USB_A',
  USB_B = 'USB_B',
  USB_C = 'USB_C',
  USB_MINI = 'USB_MINI',
  USB_MICRO = 'USB_MICRO',
  DIN = 'DIN',
}

export enum PortDirectionality {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

export type AudioConnectors = PortConnectors.TRS | PortConnectors.TR | PortConnectors.MINI_TRS | PortConnectors.MINI_TS
export type MidiConnectors = PortConnectors.DIN | PortConnectors.MINI_TRS
export type UsbConnectors = PortConnectors.USB_A | PortConnectors.USB_B | PortConnectors.USB_C | PortConnectors.USB_MINI | PortConnectors.USB_MICRO


