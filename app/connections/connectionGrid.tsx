import { Checkbox } from "@mui/material"
import { Port, PortDirectionality, PortTypes } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import { useState } from "react"

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
            <thead>
                <tr>
                    <td colSpan={2} rowSpan={2}>Connection Grid</td>
                    { inputDevices?.map(d =>
                        <th className="device" key={ `inputs_${d.id}` } colSpan={ d.inputPorts.length }>{ d.name }</th>
                    )}
                </tr>
                <tr>
                    { inputDevices?.map(d => d.inputPorts.map(p => 
                        <th className="port" key={ `input_port_${p.id}` }>{ p.name }</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                { outputDevices?.map(d => d.outputPorts.map((p, i) => (
                    i < 1 ?
                        <tr key={`output_port_${p.id}`}>
                            <th className="device" rowSpan={ d.outputPorts.length }>{ d.name }</th>
                            <th className="port">{ p.name }</th>
                            { inputDevices?.map(d => d.inputPorts.map(i => 
                                <td key={`connection_${p.id}_${i.id}`}><Checkbox size="small" sx={{ padding: 0, borderColor: 'transparent' }} /></td>
                            ))}
                        </tr>
                    :
                        <tr key={`output_port_${p.id}`}>
                            <th className="port">{ p.name }</th>
                            { inputDevices?.map(d => d.inputPorts.map(i => 
                                <td key={`connection_${p.id}_${i.id}`}><Checkbox size="small" sx={{ padding: 0, borderColor: 'transparent' }} /></td>
                            ))}
                        </tr>
                    
                )))}
            </tbody>
            
        </table>
    )
}