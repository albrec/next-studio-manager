import { Device, Port } from "./descriptions"

export function getDeviceFromPort({ port, devices }: { port: Port, devices: Device[] }) {
    return devices.find(d => d.ports.some(p => p.id === port.id))
}