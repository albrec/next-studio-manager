import { Checkbox } from "@mui/material"
import { Port, PortDirectionality, PortTypes } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import { useState } from "react"
import classNames from "classnames"

export function ConnectionGrid () {
    const devices = useDevices()
    const decoratedDevices = devices?.map(d => ({ 
        ...d,
        inputPorts: d.ports.filter(p => p.io === PortDirectionality.INPUT || (p.type === PortTypes.USB && p.host)),
        outputPorts: d.ports.filter(p => PortDirectionality.OUTPUT || (p.type === PortTypes.USB && !p.host)),
    }))

    const inputDevices = decoratedDevices?.filter(d => d.inputPorts.length > 0)
    const outputDevices = decoratedDevices?.filter(d => d.outputPorts.length > 0)

    type PortIntersection = {
        input: Port extends { io: PortDirectionality.INPUT } ? Port['id'] : never,
        output: Port extends { io: PortDirectionality.OUTPUT } ? Port['id'] : never,
    }
    const [hoveredConnection, setHoveredConnection] = useState<PortIntersection>()
    

    return (
        <table className="connection-grid">
            <colgroup>
                <col className="output_headers" span={2} />
                { inputDevices?.map(d => 
                    <col className="device" key={ `device_col_${d.id}` } span={ d.inputPorts.length } />
                )}
            </colgroup>
            <thead>
                <tr>
                    <td colSpan={2} rowSpan={2}>Connection Grid</td>
                    { inputDevices?.map(d =>
                        <th className="device" key={ `inputs_${d.id}` } colSpan={ d.inputPorts.length }><span>{ d.name }</span></th>
                    )}
                </tr>
                <tr>
                    { inputDevices?.map(d => d.inputPorts.map((p, i, a) => 
                        <th className={ classNames('port', { 'first-port': i === 0, 'last-port': i === a.length - 1 }) } key={ `input_port_${p.id}` }><span>{ p.name }</span></th>
                    ))}
                </tr>
            </thead>
            <tbody>
                { outputDevices?.map((d, di) => d.outputPorts.map((p, i, a) => (
                    i < 1 ?
                        <tr className={ classNames("first-port", !(di & 1) ? 'odd' : 'even') } key={`output_port_${p.id}`}>
                            <th className="device" rowSpan={ d.outputPorts.length }>{ d.name }</th>
                            <th className="port">{ p.name }</th>
                            { inputDevices?.map(d => d.inputPorts.map(i => 
                                <td key={`connection_${p.id}_${i.id}`}></td>
                            ))}
                        </tr>
                    :
                        <tr className={ classNames({ 'last-port': i === a.length - 1 }, !(di & 1) ? 'odd' : 'even') } key={`output_port_${p.id}`}>
                            <th className="port">{ p.name }</th>
                            { inputDevices?.map(d => d.inputPorts.map(i => 
                                <td key={`connection_${p.id}_${i.id}`}></td>
                            ))}
                        </tr>
                    
                )))}
            </tbody>
            
        </table>
    )
}