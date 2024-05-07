export type Device = {
    id: string,
    name: string,
    ports: Port[],
}

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

export interface PortBase {
    id: string,
    name: string,
}

export interface AudioPort extends PortBase {
    type: PortTypes.AUDIO,
    subType: AudioPortSubTypes,
    connector: AudioConnectors,
    io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface MidiPort extends PortBase {
    type: PortTypes.MIDI,
    connector: MidiConnectors,
    io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface UsbPort extends PortBase {
    type: PortTypes.USB,
    host: boolean,
    connector: UsbConnectors,
    io: PortDirectionality.BIDIRECTIONAL,
}

export type Port = AudioPort | MidiPort | UsbPort