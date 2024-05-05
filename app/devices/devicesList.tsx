import { useDevices, useDevicesDispatch } from "@/app/state/deviceContext"

export default function DevicesList () {
    const devices = useDevices();
    const dispatch = useDevicesDispatch()
    return (
        <>
            <h2>Devices</h2>
            <h3>Number of Devices: { devices.length }</h3>
            <ul>
            { devices && devices.map(device => (
                <li
                    className="card card-body card-bordered"
                    key={device.id}
                >
                    <h4 className="card-title">{ device.name }</h4>
                    <a className="btn" onClick={e => dispatch && dispatch({ type: 'delete', id: device.id })}>Delete</a>
                </li>
            ))}
            </ul>
        </>
    )
}