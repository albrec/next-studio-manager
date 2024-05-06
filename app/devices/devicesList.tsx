import { useDevices, useDevicesDispatch } from "@/app/state/deviceContext"
import AddPort from "./addPort";
import { PortTypes } from "../state/descriptions";

export default function DevicesList () {
    const devices = useDevices();
    const dispatch = useDevicesDispatch()
    return (
        <>
            <h2>Devices</h2>
            <h3>Number of Devices: { devices ? devices.length : 0 }</h3>
            <ul>
            { devices && devices.map(device => (
                <li
                    className="card card-body card-bordered"
                    key={ device.id }
                >
                    <h4 className="card-title">{ device.name }</h4>
                    <button className="btn" onClick={e => dispatch && dispatch({ type: 'delete', id: device.id })}>Delete</button>

                    <h5>Ports:</h5>
                    <AddPort device={ device } />
                    <ul>
                        { device.ports && device.ports.map(port => (
                            <li key={ port.id }>
                                <h5>Port: { port.name }</h5>
                                <div>Type: { port.type }</div>
                                <div>Connector: { port.connector }</div>
                                { port.type === PortTypes.USB ? 
                                    <div>Host Port: <input className="input-checkbox" type="checkbox" checked={ port.host } readOnly /></div>
                                :
                                    <div>IO: { port.io }</div>
                                }
                                <button className="btn" onClick={e => dispatch && dispatch({ type: 'deletePort', id: device.id, portId: port.id })}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
            </ul>
        </>
    )
}