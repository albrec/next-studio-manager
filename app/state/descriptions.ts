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

export interface Port {
    id: string,
    name: string,
    type: PortTypes,
    connector: PortConnectors,
    io: PortDirectionality,
    host?: boolean,
}

export interface AudioPort extends Port {
    type: PortTypes.AUDIO,
    subType: AudioPortSubTypes,
    connector: PortConnectors.TRS | PortConnectors.TR | PortConnectors.MINI_TRS | PortConnectors.MINI_TS,
    io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface MidiPort extends Port {
    type: PortTypes.MIDI,
    connector: PortConnectors.DIN | PortConnectors.MINI_TRS,
    io: PortDirectionality.INPUT | PortDirectionality.OUTPUT,
}

export interface UsbPort extends Port {
    type: PortTypes.USB,
    host: boolean,
    connector: PortConnectors.USB_A | PortConnectors.USB_B | PortConnectors.USB_C | PortConnectors.USB_MINI | PortConnectors.USB_MICRO,
    io: PortDirectionality.BIDIRECTIONAL,
}
