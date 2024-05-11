import { v4 as uuidv4 } from 'uuid';
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDevicesDispatch } from "../state/deviceContext";
import { AudioPort, AudioPortSubTypes, Device, MidiPort, Port, PortConnectors, PortDirectionality, PortTypes,  UsbPort } from '../state/descriptions';
import classNames from 'classnames';

export default function PortForm ({ port, device, className, closeModal }: { port?: Port, device: Device, className: string, closeModal(): void }) {
    const [name, setName] = useState(port?.name || '')
    const [type, setType] = useState(port?.type || '')
    const [subType, setSubType] = useState(port?.type === PortTypes.AUDIO && port?.subType ? port.subType : '')
    const [connector, setConnector] = useState(port?.connector || '')
    const [io, setIo] = useState(port?.io || '')
    const [host, setHost] = useState(port?.type === PortTypes.USB && port?.host ? port.host : false)
    const dispatch = useDevicesDispatch()
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputRef.current?.focus()
    })

    function submitForm(e: FormEvent) {
        e.preventDefault();
        e.stopPropagation();
        let p = {
            id: port?.id || uuidv4(),
            name,
            type,
            connector,
            io,
        }
        switch(type) {
            case PortTypes.USB: {
                p = {
                    ...p,
                    io: PortDirectionality.BIDIRECTIONAL,
                    host,
                } as UsbPort
                break;
            }
            case PortTypes.AUDIO: {
                p = {
                    ...p,
                    subType,
                } as AudioPort
                break;
            }
            case PortTypes.MIDI: {
                p = {
                    ...p,
                } as MidiPort
                break;
            }
        }
        if(typeof p !== 'undefined') {
            dispatch?.({
                type: 'addPort',
                id: device.id,
                port: p,
            });
            closeModal()
        }
    }

    return (
        <dialog className={ classNames('modal', className)}>
            <div className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={ closeModal }>✕</button>
                <form
                    onSubmit={ submitForm }
                >
                    <div>
                        <h3 className="card-title">Add Port</h3>
                        <label className="input input-bordered flex items-center gap-2">
                            Name
                            <input
                                type="text"
                                placeholder="Name of port"
                                value={ name }
                                onChange={ e => setName(e.target.value) }
                                ref={ inputRef }
                            />
                
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            Type
                            <TypeSelect />
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
                            !!type && 
                            <label className="input input-bordered flex items-center gap-2">
                                IO
                                <IoSelect />
                            </label>
                        }


                        { !!type && type === PortTypes.AUDIO && 
                            <label className="input input-bordered flex items-center gap-2">
                                SubType
                                <SubTypeSelect />
                            </label>
                        }


                        { !!type && (type === PortTypes.MIDI || type === PortTypes.USB || (type === PortTypes.AUDIO && !!subType)) && 
                            <label className="input input-bordered flex items-center gap-2">
                                Connector
                                <ConnectorSelect />
                            </label>
                        }
                

                        <button className='btn'>Add</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={ closeModal }>close</button>
            </form>
        </dialog>
    )


    function TypeSelect () {
        return (
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
        )
    }


    function SubTypeSelect () {
        return (
            <select
                onChange={ e => setSubType(e.target.value as AudioPortSubTypes) }
                value={ subType }
                required
            >
                <option value="">--Select audio port type--</option>
                <option value={ AudioPortSubTypes.BALANCED }>{ AudioPortSubTypes.BALANCED }</option>
                <option value={ AudioPortSubTypes.UNBALANCED }>{ AudioPortSubTypes.UNBALANCED }</option>
                <option value={ AudioPortSubTypes.STEREO }>{ AudioPortSubTypes.STEREO }</option>
            </select>
        )
    }


    function ConnectorSelect () {
        const subTypeSelected = !!subType
        let connectors
    
        switch(type) {
            case PortTypes.AUDIO: {
                connectors = subType === AudioPortSubTypes.UNBALANCED ? [PortConnectors.TR, PortConnectors.MINI_TS] : [PortConnectors.TRS, PortConnectors.MINI_TRS]
                break
            }
            case PortTypes.MIDI: {
                connectors = [PortConnectors.DIN, PortConnectors.TRS]
                break
            }
            case PortTypes.USB: {
                connectors = !!host ? [PortConnectors.USB_A, PortConnectors.USB_C] : [PortConnectors.USB_B, PortConnectors.USB_C, PortConnectors.USB_MINI, PortConnectors.USB_MICRO]
                break
            }
        }
        
        return (
            <select
                onChange={ e => setConnector(e.target.value) }
                value={ connector }
                required
            >
                <option>--Select a connector--</option>
                { connectors?.map(connector => (
                    <option key={ `connector_${connector}`} value={ connector }>{ connector }</option>
                ))}
            </select>
        )
    }



    function IoSelect () {
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
}






