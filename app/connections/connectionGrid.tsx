import { Checkbox } from "@mui/material"
import { Port, PortDirectionality, PortTypes } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import { Dispatch, SetStateAction, useState } from "react"
import classNames from "classnames"
import { getDeviceFromPort } from "../state/deviceSelectors"
import { DeviceHub, Hub } from "@mui/icons-material"

type PortIntersection = {
    input: Port,
    output: Port,
}

export function ConnectionGrid () {
    const devices = useDevices()
    const [hoveredConnection, setHoveredConnection] = useState<PortIntersection | null>(null)

    return (
        <>
            <HighlightStyles hoveredConnection={ hoveredConnection } />
            <GridTable setHoveredConnection={ setHoveredConnection } />
        </>
    )

    function GridTable({ setHoveredConnection }: { setHoveredConnection: Dispatch<SetStateAction<PortIntersection | null>> | null }) {
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
                        <td colSpan={2}></td>
                        { inputDevices?.map(d =>
                            <th className="device" id={ `input_device_${d.id}` } key={ `inputs_${d.id}` } colSpan={ d.inputPorts.length }><span>{ d.name }</span></th>
                        )}
                    </tr>
                    <tr>
                        <td colSpan={2}><DeviceHub sx={{ fontSize: 72 }} /></td>
                        { inputDevices?.map(d => d.inputPorts.map((p, i, a) => 
                            <th className={ classNames('port', { 'first-port': i === 0, 'last-port': i === a.length - 1 }) } id={ `input_port_${p.id}` } key={ `input_port_${p.id}` }><span>{ p.name }</span></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { outputDevices?.map((d, di) => d.outputPorts.map((p, i, a) => (
                        i < 1 ?
                            <tr className={ classNames("first-port", !(di & 1) ? 'odd' : 'even') } key={`output_port_${p.id}`}>
                                <th className="device" id={ `output_device_${d.id}` } rowSpan={ d.outputPorts.length }>{ d.name }</th>
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

        if(!hoveredConnection || !devices) return null

        const inputDevice = getDeviceFromPort({ devices, port: hoveredConnection.input })
        const outputDevice = getDeviceFromPort({ devices, port: hoveredConnection.output })
        
        return (
            <style>
                { 
                    `
                    ${tableSelector} tbody tr:hover td.port-type-${hoveredConnection.output.type} {
                        background-color: var(--table-compatible-color-light);
                    }

                    ${tableSelector} tbody tr:hover td:not(.port-type-${hoveredConnection.output.type}) {
                        background-color: var(--table-incompatible-color-light);
                    }

                    ${tableSelector} td.port-col-${hoveredConnection.input.id} {
                        background-color: var(--table-hover-color);
                    }

                    ${tableSelector} tr:hover td.port-col-${hoveredConnection.input.id} {
                        background-color: var(${hoveredConnection.input.type === hoveredConnection.output.type ? '--table-compatible-color' : '--table-incompatible-color'}) !important;
                    }

                    ${tableSelector} #input_port_${hoveredConnection.input.id},
                    ${tableSelector} #input_device_${inputDevice?.id || 'unknown_devices'},
                    ${tableSelector} #output_device_${outputDevice?.id || 'unknown_devices'} {
                        background-color: var(--table-hover-color) !important;
                        color: var(--foreground-rgb);
                    }
                    `
                }
            </style>
        )
    }
}