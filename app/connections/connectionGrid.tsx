import { Checkbox } from "@mui/material"
import { Port, PortDirectionality, PortTypes } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import { Dispatch, SetStateAction, useState } from "react"
import classNames from "classnames"

type PortIntersection = {
    input: Port,
    output: Port,
}

export function ConnectionGrid () {
    const [hoveredConnection, setHoveredConnection] = useState<PortIntersection | null>(null)

    return (
        <>
            <HighlightStyles hoveredConnection={ hoveredConnection } />
            <GridTable setHoveredConnection={ setHoveredConnection } />
        </>
    )

    function GridTable({ setHoveredConnection }: { setHoveredConnection: Dispatch<SetStateAction<PortIntersection | null>> | null }) {
        const devices = useDevices()
        const decoratedDevices = devices?.map(d => ({ 
            ...d,
            inputPorts: d.ports.filter(p => p.io === PortDirectionality.INPUT || (p.type === PortTypes.USB && p.host)),
            outputPorts: d.ports.filter(p => PortDirectionality.OUTPUT || (p.type === PortTypes.USB && !p.host)),
        }))

        const inputDevices = decoratedDevices?.filter(d => d.inputPorts.length > 0)
        const outputDevices = decoratedDevices?.filter(d => d.outputPorts.length > 0)

        return (
            <table className="connection-grid mb-8">
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
                            <th className={ classNames('port', { 'first-port': i === 0, 'last-port': i === a.length - 1 }) } id={ `input_port_${p.id}` } key={ `input_port_${p.id}` }><span>{ p.name }</span></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { outputDevices?.map((d, di) => d.outputPorts.map((p, i, a) => (
                        i < 1 ?
                            <tr className={ classNames("first-port", !(di & 1) ? 'odd' : 'even') } key={`output_port_${p.id}`}>
                                <th className="device" rowSpan={ d.outputPorts.length }>{ d.name }</th>
                                <th className="port">{ p.name }</th>
                                { inputDevices?.map(d => d.inputPorts.map(inPort => 
                                    <ConnectionNode portIntersection={ { input: inPort, output: p } } key={`connection_${p.id}_${inPort.id}`} />
                                ))}
                            </tr>
                        :
                            <tr className={ classNames({ 'last-port': i === a.length - 1 }, !(di & 1) ? 'odd' : 'even') } key={`output_port_${p.id}`}>
                                <th className="port">{ p.name }</th>
                                { inputDevices?.map(d => d.inputPorts.map(inPort => 
                                    <ConnectionNode portIntersection={ { input: inPort, output: p } } key={`connection_${p.id}_${inPort.id}`} />
                                ))}
                            </tr>
                        
                    )))}
                </tbody>
                
            </table>
        )
    }


    function ConnectionNode({ portIntersection }: { portIntersection: PortIntersection }) {
        const { input, output } = portIntersection

        return (
            <td
                className={ classNames(`port-col-${input.id}`, `port-type-${input.type}`) }
                onMouseEnter= { e => setHoveredConnection(portIntersection) }
                onMouseLeave={ e => setHoveredConnection(null) }
            />
        )
    }

    function HighlightStyles({ hoveredConnection }: { hoveredConnection: PortIntersection | null }) {
        const tableSelector = 'table.connection-grid'
        const compatibleColor = '0, 255, 0'
        const inCompatibleColor = '255, 0, 0'
        
        return !!hoveredConnection ? (
            <style>
                { 
                    `
                    ${tableSelector} tbody tr:hover td.port-type-${hoveredConnection.output.type} {
                        background-color: rgba(${compatibleColor}, 0.2);
                    }

                    ${tableSelector} tbody tr:hover td:not(.port-type-${hoveredConnection.output.type}) {
                        background-color: rgba(${inCompatibleColor}, 0.2);
                    }

                    ${tableSelector} td.port-col-${hoveredConnection.input.id} {
                        background-color: rgba(${hoveredConnection.input.type === hoveredConnection.output.type ? compatibleColor : inCompatibleColor}, 0.2);
                    }

                    ${tableSelector} tr:hover td.port-col-${hoveredConnection.input.id} {
                        background-color: rgba(${hoveredConnection.input.type === hoveredConnection.output.type ? compatibleColor : inCompatibleColor}, 0.8) !important;
                    }

                    ${tableSelector} #input_port_${hoveredConnection.input.id} {
                        background-color: rgba(0, 0, 255, 0.2) !important;
                    }
                    `
                }
            </style>
        ) : null
    }
}