import { useState } from "react"
import { Device, Port, PortTypes } from "../state/descriptions"
import { useDevicesDispatch } from "../state/deviceContext"
import PortForm from "./portForm"
import classNames from "classnames"
import DeviceForm from "./deviceForm"

export default function DeviceListing ({ device }: { device: Device }) {
    const dispatch = useDevicesDispatch()
    const [deviceModalOpen, setDeviceModalOpen] = useState(false)
    const [portModalOpen, setPortModalOpen] = useState(false)
    const [editPort, setEditPort] = useState<Port | null>(null)

    function openPortModal(port?: Port) {
        setEditPort(port ? port : null)
        setPortModalOpen(true)
    }

    function closePortModal() {
        setEditPort(null)
        setPortModalOpen(false)
    }

    function sortPorts(ports: Port[]) {
        return ports.sort((a,b) => a.type.localeCompare(b.type))
    }

    return (
        <li
            className="px-8 py-12"
            key={ device.id }
        >
            
            <div className="flex items-center mb-8">
                <h4>{ device.name } </h4>
                <button onClick={ e => { setDeviceModalOpen(true) } }>Edit</button>
                <button onClick={e => dispatch?.({ type: 'delete', id: device.id })}>Delete</button>
                <button onClick={ e => openPortModal() }>Add Port </button>
            </div>
            
            { deviceModalOpen && <DeviceForm device={ device } className={ classNames({ 'modal-open': deviceModalOpen })} closeModal={ () => setDeviceModalOpen(false) } /> }

            <h5>Ports</h5>
            { portModalOpen && <PortForm port={ editPort } className={ classNames({ 'modal-open': portModalOpen })} closeModal={ closePortModal } device={ device } /> }
            <ul className="flex flex-wrap gap-4 relative">
                { device.ports && sortPorts(device.ports).map(port => (
                    <li className="shrink border-2 p-4 pt-10 relative" key={ port.id }>
                        <div className="text-nowrap">Port: { port.name }</div>
                        <div className="text-nowrap">Type: { port.type }</div>
                        { port.type === PortTypes.AUDIO && <div className="text-nowrap">Sub Type: { port.subType }</div> }
                        <div className="text-nowrap">Connector: { port.connector }</div>
                        { port.type === PortTypes.USB ? 
                            <div className="flex items-center text-nowrap">Host Port: <input className="checkbox checkbox-sm ml-2" type="checkbox" checked={ port.host } readOnly /></div>
                        :
                            <div className="text-nowrap">IO: { port.io }</div>
                        }
                        <div className="absolute right-2 top-2 ">
                            <button onClick={ e => { openPortModal(port) } }>Edit</button>
                            <button onClick={ e => dispatch?.({ type: 'deletePort', id: device.id, portId: port.id }) }>Delete</button>
                        </div>
                        
                    </li>
                ))}
            </ul>
        </li>
    )
}