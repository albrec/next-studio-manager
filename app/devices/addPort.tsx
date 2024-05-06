import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { useDevicesDispatch } from "../state/deviceContext";
import { Device, Port, PortConnectors, PortDirectionality, PortTypes } from '../state/descriptions';

export default function AddPort ({ device }: { device: Device }) {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [connector, setConnector] = useState('')
    const [io, setIo] = useState('')
    const [host, setHost] = useState(false)
    const dispatch = useDevicesDispatch()

    function resetForm () {
        setName('')
        setType('')
        setConnector('')
        setIo('')
    }

    return (
        <form
            className="card"
            onSubmit={ e => {
                e.preventDefault();
                e.stopPropagation();
                if(!dispatch) throw new TypeError('Cannot dispatch action "addPort" as dispatch is null');
                let port
                switch(type) {
                    case PortTypes.USB: {
                        if (!!connector) port = {
                            id: uuidv4(),
                            name,
                            type,
                            connector,
                            io: PortDirectionality.BIDIRECTIONAL,
                            host,
                        }
                        break;
                    }
                    default: {
                        if(!!type && !!connector && !!io) port = {
                            id: uuidv4(),
                            name,
                            type,
                            connector,
                            io,
                        }
                        break;
                    }
                }

                if(typeof port !== 'undefined') {
                    resetForm();
                    dispatch({
                        type: 'addPort',
                        id: device.id,
                        port,
                    });
                }
            }}
        >
            <div className="card-body">
                <h3 className="card-title">Add Port</h3>

                <label className="input input-bordered flex items-center gap-2">
                    Name
                    <input
                        type="text"
                        placeholder="Name of port"
                        value={ name }
                        onChange={ e => setName(e.target.value) }
                    />
                    
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Type
                    <select
                        onChange={ e => setType(e.target.value as PortTypes) }
                        value={ type }
                        required
                    >
                        <option value="">--Select a type--</option>
                        <option value={ PortTypes.AUDIO }>{ PortTypes.AUDIO }</option>
                        <option value={ PortTypes.MIDI }>{ PortTypes.MIDI }</option>
                        <option value={ PortTypes.USB }>{ PortTypes.USB }</option>
                    </select>
                    
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Connector
                    <ConnectorSelect type={ type } connector={ connector } setConnector={ setConnector} />
                </label>

                { (type === PortTypes.USB ) ? 
                    <label className="input input-checkbox flex items-center gap-2">
                        <input 
                            type="checkbox"
                            onChange={ e => setHost(!host) }
                            checked={ host }
                        />
                        USB Host Port
                    </label>
                 : 
                    <label className="input input-bordered flex items-center gap-2">
                        IO
                        <IoSelect type={ type } io={ io } setIo={ setIo } />
                    </label>
                }
                
                
                <button className='btn'>Add</button>
            </div>
        </form>
    )
}

function ConnectorSelect ({ type, connector, setConnector }: { type: string, connector: string, setConnector: React.Dispatch<React.SetStateAction<string>> }) {
    const typeSelected = !!type
    let connectors

    switch(type) {
        case PortTypes.AUDIO: {
            connectors = [PortConnectors.TRS, PortConnectors.TR, PortConnectors.MINI_TRS, PortConnectors.MINI_TS]
            break
        }
        case PortTypes.MIDI: {
            connectors = [PortConnectors.DIN, PortConnectors.TRS]
            break
        }
        case PortTypes.USB: {
            connectors = [PortConnectors.USB_A, PortConnectors.USB_B, PortConnectors.USB_C, PortConnectors.USB_MINI, PortConnectors.USB_MICRO]
            break
        }
    }
    
    return (
        (!typeSelected) ? (
            <select>
                <option value="">--Please select a type first--</option>
            </select>
        ) : (
            <select
                onChange={ e => setConnector(e.target.value as PortConnectors) }
                value={ connector }
                required
            >
                <option>--Select a connector--</option>
                { connectors?.map(connector => (
                    <option key={ `connector_${connector}`} value={ connector }>{ connector }</option>
                ))}
            </select>
        )
    )
}

function IoSelect ({ type, io, setIo }: { type: string, io: string, setIo: React.Dispatch<React.SetStateAction<string>> }) {
    const typeSelected = !!type
    let directions

    switch(type) {
        case PortTypes.AUDIO: {
            directions = [PortDirectionality.INPUT, PortDirectionality.OUTPUT]
            break
        }
        case PortTypes.MIDI: {
            directions = [PortDirectionality.INPUT, PortDirectionality.OUTPUT]
            break
        }
        case PortTypes.USB: {
            directions = [PortDirectionality.BIDIRECTIONAL]
            break
        }
    }
    
    return (
        (!typeSelected) ? (
            <select>
                <option>--Please select a type first--</option>
            </select>
        ) : (
            <select
                onChange={ e => setIo(e.target.value as PortDirectionality) }
                value={ io }
                required
            >
                <option>--Select an IO direction--</option>
                { directions?.map(direction => (
                    <option key={ `direction_${direction}`} value={ direction }>{ direction }</option>
                ))}
            </select>
        )
    )
}
