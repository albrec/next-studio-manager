import { ConnectionAddress } from "@/lib/features/connections/connectionTypes"
import { getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { AudioPortSubTypes, Port, PortConnectors, PortTypes } from "@/lib/features/ports/portTypes"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { DeviceHub } from "@mui/icons-material"
import classNames from "classnames"
import { Dispatch, SetStateAction, memo } from "react"
import ConnectionNode from "./ConnectionNode"
import { isStereo } from "@/lib/features/ports/portsSlice"

export default memo(function GridTable({ portTypes }: { portTypes: PortTypes[] }) {
  const decoratedDevices = useAppSelector(getDecoratedDevices(portTypes))
  const dispatch = useAppDispatch()

    
  const inputDevices = decoratedDevices.filter(d => d.inputs.length > 0)
  const outputDevices = decoratedDevices.filter(d => d.outputs.length > 0)

  return (
    <table className="connection-grid mb-8">
      <colgroup>
        <col className="output_headers" span={2} />
        { inputDevices?.map(d => 
          <col className="device" key={ `device_col_${d.id}` } span={ d.inputs.length } />
        )}
      </colgroup>
      <thead>
        <tr>
          <td colSpan={2}></td>
          { inputDevices?.map(d =>
            <th className="device" id={ `input_device_${d.id}` } key={ `inputs_${d.id}` } colSpan={ d.inputs.length }><span>{ d.name }</span></th>
          )}
        </tr>
        <tr>
          <td colSpan={2}><DeviceHub sx={{ fontSize: 72 }} /></td>
          { inputDevices?.map(d => d.inputs.map((p, i, a) => 
            <th className={ classNames('port', { 'first-port': i === 0, 'last-port': i === a.length - 1 }) } id={ `input_port_${p.id}` } key={ `input_port_${p.id}` }>
              <span>{ p.name }{ isStereo(p) && '*' }</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        { outputDevices?.map((d, di) => d.outputs.map((p, i, a) => (
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
                            <th className="device" id={ `output_device_${d.id}` } rowSpan={ d.outputs.length }>{ d.name }</th>
            }
            <th className="port" id={ `output_port_${p.id}` }>
              { p.name }{ isStereo(p) && '*' }
            </th>

            { inputDevices?.map(d => d.inputs.map(input => 
              <ConnectionNode
                inputId={ input.id }
                // inputType={ input.type }
                outputId={ p.id}
                // outputType={ p.type }
                key={`connection_${p.id}_${input.id}`}
              />
            ))}

          </tr>
        )))}
      </tbody>
    </table>
  )
})