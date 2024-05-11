import { PortDirectionality } from "../state/descriptions";
import { useDevices } from "../state/deviceContext";

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
        <table className="table table-zebra">
            <thead>
                <tr>
                    { inputDevices?.map(d =>
                        <td key={ `inputs_${d.id}` } colSpan={ d.inputPorts.length }>{ d.name }</td>
                    )}
                </tr>
                <tr>
                    { inputDevices?.map(d => d.inputPorts.map(p => 
                        <td key={ `input_port_${p.id}` }>{ p.name }</td>
                    ))}
                </tr>
            </thead>
        </table>
    )
}