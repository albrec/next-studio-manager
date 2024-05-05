export type Device = {
    id: string,
    name: string,
    ports?: Port[],
}

export interface Port {
    id: string,
    name: string,
    type: string,
    connector: string,
    io: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL',
}

export interface AudioPort extends Port {
    type: 'AUDIO',
    subType: 'BALANCED' | 'UNBALANCED' | 'STEREO',
    connector: '1/4 TRS' | '1/4 TS' | '3.5MM TRS' | '3.5MM TS',
    io: 'INPUT' | 'OUTPUT',
}

export interface MidiPort extends Port {
    type: 'MIDI',
    connector: 'DIN' | '3.5MM TRS',
    io: 'INPUT' | 'OUTPUT',
}

export interface UsbPort extends Port {
    type: 'USB',
    host: boolean,
    connector: 'USB-A' | 'USB-B' | 'USB-C' | 'USB-MINI' | 'USB-MICRO',
    io: 'BIDRECTIONAL'
}

