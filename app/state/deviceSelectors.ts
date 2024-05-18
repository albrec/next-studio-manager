import { Device, Port } from "./descriptions"

export function getDeviceFromPort({ port, devices }: { port: Port | string, devices: Device[] }) {
    const portId = typeof port === 'string' ? port : port.id
    return devices.find(d => d.ports.some(p => p.id === portId))
}

export function getPortById(devices: Device[], id: string) {
    const ports = devices.reduce<Port[]>((acc, d) => {
        return acc.concat(d.ports)
    }, [])
    return ports.find(p => p.id === id)
}