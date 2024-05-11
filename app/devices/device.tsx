import { useState } from "react";
import { Device, PortTypes } from "../state/descriptions";
import { useDevicesDispatch } from "../state/deviceContext";
import PortForm from "./portForm";
import classNames from "classnames";
import DeviceForm from "./deviceForm";

export default function DeviceListing ({ device }: { device: Device }) {
    const dispatch = useDevicesDispatch()
    const [portModalOpen, setPortModalOpen] = useState(false)
    const [deviceModalOpen, setDeviceModalOpen] = useState(false)

    return (
        <li
            className="border-2 p-8"
            key={ device.id }
        >
            <h4 className="card-title">{ device.name } 
            | <button className="btn" onClick={ e => setPortModalOpen(true) }>Add Port</button> 
            | <button className="btn" onClick={ e => { setDeviceModalOpen(true) } }>Edit</button>
            | <button className="btn" onClick={e => dispatch?.({ type: 'delete', id: device.id })}>Delete</button></h4>

            <DeviceForm device={ device } className={ classNames({ 'modal-open': deviceModalOpen })} closeModal={ () => setDeviceModalOpen(false) } />

            <h5>Ports:</h5>
            <PortForm className={ classNames({ 'modal-open': portModalOpen })} closeModal={ () => setPortModalOpen(false) } device={ device } />
            <ul className="flex gap-4">
                { device.ports && device.ports.map(port => (
                    <li className="shrink border-2 p-4" key={ port.id }>
                        <h5>Port: { port.name }</h5>
                        <div>Type: { port.type }</div>
                        { port.type === PortTypes.AUDIO && <div>Sub Type: { port.subType }</div> }
                        <div>Connector: { port.connector }</div>
                        { port.type === PortTypes.USB ? 
                            <div>Host Port: <input className="input-checkbox" type="checkbox" checked={ port.host } readOnly /></div>
                        :
                            <div>IO: { port.io }</div>
                        }
                        <button className="btn" onClick={ e => dispatch?.({ type: 'deletePort', id: device.id, portId: port.id }) }>Delete</button>
                    </li>
                ))}
            </ul>
        </li>
    )
}