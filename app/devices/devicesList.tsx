import { useDevices, useDevicesDispatch } from "../../state/deviceContext"

export default function DevicesList () {
    const devices = useDevices();
    const dispatch = useDevicesDispatch()
    return (
        <>
            <h3>Number of Devices: { devices.length }</h3>
            <ul>
            { devices.map(device => (
                <li key={device.id}>Device: { device.name } | ID: { device.id } | <a onClick={e => dispatch({ type: 'delete', id: device.id })}>Delete</a></li>
            ))}
            </ul>
        </>
    )
}