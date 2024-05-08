import { useState } from "react";
import { Device as DeviceType, PortTypes } from "../state/descriptions";
import { useDevicesDispatch } from "../state/deviceContext";
import AddPort from "./addPort";
import classNames from "classnames";

export default function Device ({ device }: { device: DeviceType }) {
    const dispatch = useDevicesDispatch()
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <li
            className="border-2 p-8"
            key={ device.id }
        >
            <h4 className="card-title">{ device.name } | <button className="btn" onClick={ e => setModalOpen(true) }>Add Port</button> | <button className="btn" onClick={e => dispatch && dispatch({ type: 'delete', id: device.id })}>Delete</button></h4>

            <h5>Ports:</h5>
            <AddPort className={ classNames({ 'modal-open': modalOpen })} closeModal={ () => setModalOpen(false) } device={ device } />
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
                        <button className="btn" onClick={e => dispatch && dispatch({ type: 'deletePort', id: device.id, portId: port.id })}>Delete</button>
                    </li>
                ))}
            </ul>
        </li>
    )
}