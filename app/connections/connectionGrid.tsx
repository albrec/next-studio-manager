import { PortDirectionality, PortTypes } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import { Dispatch, SetStateAction, memo, useCallback, useMemo, useState } from "react"
import classNames from "classnames"
import { getDeviceFromPort, getPortById } from "../state/deviceSelectors"
import { DeviceHub } from "@mui/icons-material"
import { ConnectionAddress, deriveConnectionId, isConnectionCompatible, useConnections, useConnectionsDispatch } from "../state/connectionContext"
import { Button, ButtonGroup } from "@mui/material"


export function ConnectionGrid () {
  const devices = useDevices()
  const connections = useConnections()
  const [hoveredConnection, setHoveredConnection] = useState<ConnectionAddress | null>(null)
  const [portTypes, setPortTypes] = useState<PortTypes[]>([PortTypes.AUDIO, PortTypes.MIDI, PortTypes.USB])
    
  const connectionMap = useMemo(() => connections?.map(c => c.id), [connections])
    
  return (
    <>
      <HighlightStyles />
      <ButtonGroup>
        <Button variant={ portTypes.includes(PortTypes.AUDIO) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.AUDIO) }>Audio</Button>
        <Button variant={ portTypes.includes(PortTypes.MIDI) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.MIDI) }>MIDI</Button>
        <Button variant={ portTypes.includes(PortTypes.USB) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.USB) }>USB</Button>
      </ButtonGroup>
      <GridTable portTypes={ portTypes } connectionMap={ connectionMap } setHoveredConnection={ setHoveredConnection } />
    </>
  )



  function toggleFilter(portType: PortTypes) {
    const newPortType = portTypes.includes(portType) ? portTypes.filter(p => p !== portType) : [...portTypes, portType]
    if(newPortType.length > 0) {
      setPortTypes(newPortType)
    }
  }
    
    
    
  function HighlightStyles() {
    const tableSelector = 'table.connection-grid'
        
    if(!hoveredConnection || !devices) return null
        
    const input = getPortById(devices, hoveredConnection.input)
    const output = getPortById(devices, hoveredConnection.output)
    const inputDevice = getDeviceFromPort({ devices, port: hoveredConnection.input })
    const outputDevice = getDeviceFromPort({ devices, port: hoveredConnection.output })

    if(!(input && output)) return null
        
    return (
      <style>
        { 
          `
                ${tableSelector} tbody tr:hover td.port-type-${output.type} {
                    background-color: var(--table-compatible-color-light);
                }
                
                ${tableSelector} tbody tr:hover td:not(.port-type-${output.type}) {
                    background-color: var(--table-incompatible-color-light);
                }
                
                ${tableSelector} td.input-port-id-${input.id} {
                    background-color: var(--table-hover-color);
                }
                
                ${tableSelector} td#port-intersection-${output.id}-${input.id} {
                    background-color: var(${input.type === output.type ? '--table-compatible-color' : '--table-incompatible-color'}) !important;
                }
                
                ${tableSelector} #input_port_${input.id},
                ${tableSelector} #input_device_${inputDevice?.id || 'unknown_devices'},
                ${tableSelector} #output_device_${outputDevice?.id || 'unknown_devices'} {
                    background-color: var(--table-hover-color) !important;
                    color: var(--foreground-rgb);
                }
                `
        }

        { connections?.map(c => 
          `
                    ${tableSelector} td.input-port-id-${c.inputPort.id},
                    ${tableSelector} td.output-port-id-${c.outputPort.id} {
                        background-color: var(--table-disabled-color) !important;
                    }
                    `
        )}
      </style>
    )
  }
}



const GridTable = memo(function GridTable({ portTypes, connectionMap, setHoveredConnection }: { portTypes: PortTypes[], connectionMap?: string[], setHoveredConnection: Dispatch<SetStateAction<ConnectionAddress | null>> }) {
  const devices = useDevices()
  const connectionsDispatch = useConnectionsDispatch()

  const decoratedDevices = devices?.map(d => ({ 
    ...d,
    inputPorts: d.ports
      .filter(p => portTypes.includes(p.type))
      .filter(p => p.io === PortDirectionality.INPUT || (p.type === PortTypes.USB && p.host)),
    outputPorts: d.ports
      .filter(p => portTypes.includes(p.type))
      .filter(p => p.io === PortDirectionality.OUTPUT || (p.type === PortTypes.USB && !p.host)),
  }))
    
  const inputDevices = decoratedDevices?.filter(d => d.inputPorts.length > 0)
  const outputDevices = decoratedDevices?.filter(d => d.outputPorts.length > 0)

  const toggleConnection = useCallback(function toggleConnection(input: string, output: string, isConnected: boolean) {
    if(!devices) return
    const id = deriveConnectionId({ input, output })
    if(isConnected) {
      connectionsDispatch?.({
        type: 'delete',
        id,
      })
    } else {
      const inputPort = getPortById(devices, input)
      const outputPort = getPortById(devices, output)
      if(inputPort && outputPort && isConnectionCompatible({ input: inputPort, output: outputPort })) {
        connectionsDispatch?.({
          type: 'add',
          connection: {
            inputPort,
            outputPort,
          },
        })
      }
    }
  }, [devices, connectionsDispatch])

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
          <tr 
            className={classNames(
              {
                'first-port': i === 0,
                'last-port': i === a.length,
              },
              !(di & 1) ? 'odd' : 'even',
            )}
            key={`output_port_${p.id}`}
          >
            { i === 0 && 
                            <th className="device" id={ `output_device_${d.id}` } rowSpan={ d.outputPorts.length }>{ d.name }</th>
            }
            <th className="port">{ p.name }</th>
            { inputDevices?.map(d => d.inputPorts.map(inPort => 
              <ConnectionNode
                inputId={ inPort.id }
                inputType={ inPort.type }
                outputId={ p.id}
                outputType={ p.type }
                isConnected={ !!connectionMap?.includes(deriveConnectionId({ input: inPort, output: p })) }
                toggleConnection={ toggleConnection }
                setHoveredConnection={ setHoveredConnection }
                key={`connection_${p.id}_${inPort.id}`}
              />
            ))}
          </tr>
        )))}
      </tbody>
    </table>
  )
})



const ConnectionNode = memo(function ConnectionNode({ 
  inputId,
  inputType,
  outputId,
  outputType,
  isConnected,
  toggleConnection,
  setHoveredConnection,
}: { 
    inputId: string,
    inputType: PortTypes,
    outputId: string,
    outputType: PortTypes,
    isConnected: boolean,
    toggleConnection: Function,
    setHoveredConnection: Dispatch<SetStateAction<ConnectionAddress | null>>,
}) {
  // console.count('ConnectionNode')
  return (
    <td
      id={ `port-intersection-${outputId}-${inputId}` }
      className={ classNames(`port-type-${inputType}`, `input-port-id-${inputId}`, `output-port-id-${outputId}`, { connected: isConnected }) }
      onClick={ () => toggleConnection(inputId, outputId, isConnected) }
      onMouseEnter={ () => setHoveredConnection({ input: inputId, output: outputId }) }
      onMouseLeave={ () => setHoveredConnection(null) }
    />
  )
})