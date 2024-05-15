/**
 * The type `Device` represents a device with an id, name, and an array of ports.
 * @property {string} id - The `id` property in the `Device` type represents the unique identifier of
 * the device.
 * @property {string} name - The `name` property in the `Device` type represents the name of the
 * device. It is a string type property.
 * @property {Port[]} ports - The `ports` property in the `Device` type is an array of `Port` objects.
 * Each `Port` object likely contains information about a specific port on the device, such as its
 * type, status, or configuration.
 */
export type Device = {
    id: string,
    name: string,
    ports: Port[],
}

/* The `export enum PortTypes` block is defining an enumeration in TypeScript. In this specific case,
it is defining a set of constants representing different types of ports that can be present in a
device. */
export enum PortTypes {
    AUDIO = 'AUDIO',
    MIDI = 'MIDI',
    USB = 'USB',
}

/* The `export enum AudioPortSubTypes` block is defining an enumeration in TypeScript specifically for
audio port subtypes. In this case, it is creating a set of constants representing different subtypes
of audio ports that can be present in a device. */
export enum AudioPortSubTypes {
    BALANCED = 'BALANCED',
    UNBALANCED = 'UNBALANCE',
    STEREO = 'STEREO',
}

/* The `export enum PortConnectors` block is defining an enumeration in TypeScript. In this specific
case, it is creating a set of constants representing different types of port connectors that can be
present in a device. Each constant in this enumeration represents a specific type of port connector,
such as TRS, TR, MINI_TRS, MINI_TS, USB_A, USB_B, USB_C, USB_MINI, USB_MICRO, and DIN. */
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

/* The `export enum PortDirectionality` block is defining an enumeration in TypeScript called
`PortDirectionality`. This enumeration is used to represent the possible directions or modes of a
port. */
export enum PortDirectionality {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
    BIDIRECTIONAL = 'BIDIRECTIONAL',
}

export type AudioConnectors = PortConnectors.TRS | PortConnectors.TR | PortConnectors.MINI_TRS | PortConnectors.MINI_TS
export type MidiConnectors = PortConnectors.DIN | PortConnectors.MINI_TRS
export type UsbConnectors = PortConnectors.USB_A | PortConnectors.USB_B | PortConnectors.USB_C | PortConnectors.USB_MINI | PortConnectors.USB_MICRO



/* These code snippets are defining a set of interfaces and types related to different types of ports
that can be present in a device. Here's a breakdown of what each part is doing: */
/* The `interface PortBase {` is defining a base interface that contains common properties shared by
different types of ports. In this case, the `PortBase` interface includes the `id` and `name`
properties, which are fundamental properties that all types of ports must have. By creating this
base interface, other port interfaces (`AudioPort`, `MidiPort`, `UsbPort`) can extend `PortBase` and
inherit these common properties, ensuring consistency and reusability in the codebase. */
interface PortBase {
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



/* These interfaces are defining different types of connections between ports of various types in a
device. Let's break it down: */
/* The `interface ConnectionBase` is serving as a base interface that other connection interfaces
(`AudioConnection`, `MidiConnection`, `UsbConnection`) extend from. By defining common properties or
methods in the `ConnectionBase` interface, you can ensure that all connection interfaces inherit
these common characteristics. This helps in maintaining consistency and reusability in your
codebase. */
interface ConnectionBase {
    id: string
}

// export type AudioConnection = ConnectionBase & {
//     inputPort: AudioPort extends { type: PortTypes.AUDIO, io: PortDirectionality.INPUT } ? AudioPort['id'] : never,
//     outputPort: AudioPort extends { type: PortTypes.AUDIO, io: PortDirectionality.OUTPUT } ? AudioPort['id'] : never,
// }

// export type MidiConnection = ConnectionBase & {
//     inputPort: MidiPort extends { type: PortTypes.MIDI, io: PortDirectionality.INPUT } ? MidiPort['id'] : never,
//     outputPort: MidiPort extends { type: PortTypes.MIDI, io: PortDirectionality.OUTPUT } ? MidiPort['id'] : never,
// }

// export type UsbConnection = ConnectionBase & {
//     inputPort: UsbPort extends { type: PortTypes.USB, host: true} ? UsbPort['id'] : never,
//     outputPort: UsbPort extends { type: PortTypes.USB, host: false } ? UsbPort['id'] : never,
// }

// export type Connection = AudioConnection | MidiConnection | UsbConnection

export type Connection = {
    id: string,
    inputPort: Port,
    outputPort: Port,
}