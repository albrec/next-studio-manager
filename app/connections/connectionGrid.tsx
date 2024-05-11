import { PortDirectionality } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"

export function ConnectionGrid () {
    const devices = useDevices()
    const decoratedDevices = devices?.map(d => ({ 
        ...d,
        inputPorts: d.ports.filter(p => [PortDirectionality.INPUT, PortDirectionality.BIDIRECTIONAL].includes(p.io)),
        outputPorts: d.ports.filter(p => [PortDirectionality.OUTPUT, PortDirectionality.BIDIRECTIONAL].includes(p.io)),
    }))

    const inputDevices = decoratedDevices?.filter(d => d.inputPorts.length > 0)
    const outputDevices = decoratedDevices?.filter(d => d.outputPorts.length > 0)
    

    return (
        <table className="connection-grid">
            <thead>
                <tr>
                    <th colSpan={2} rowSpan={2}>Connection Grid</th>
                    { inputDevices?.map(d =>
                        <th key={ `inputs_${d.id}` } colSpan={ d.inputPorts.length }><span>{ d.name }</span></th>
                    )}
                </tr>
                <tr>
                    { inputDevices?.map(d => d.inputPorts.map(p => 
                        <th key={ `input_port_${p.id}` }><span>{ p.name }</span></th>
                    ))}
                </tr>
            </thead>
            { outputDevices?.map(d => d.outputPorts.map((p, i) => (
                i < 1 ?
                    <tr key={`output_port_${p.id}`}>
                        <th rowSpan={ d.outputPorts.length }>{ d.name }</th>
                        <th>{ p.name }</th>
                        { inputDevices?.map(d => d.inputPorts.map(i => 
                            <td key={`connection_${p.id}_${i.id}`}><input type="checkbox" /></td>
                        ))}
                    </tr>
                :
                    <tr key={`output_port_${p.id}`}>
                        <th>{ p.name }</th>
                        { inputDevices?.map(d => d.inputPorts.map(i => 
                            <td key={`connection_${p.id}_${i.id}`}><input type="checkbox" /></td>
                        ))}
                    </tr>
                
            )))}
            
        </table>
    )
}