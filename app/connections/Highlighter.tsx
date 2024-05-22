import { ConnectionAddress } from "@/lib/features/connections/connectionTypes"
import { getPort } from "@/lib/features/ports/portsSlice"
import { useAppSelector } from "@/lib/hooks"

export default function HighlightStyles({ hoveredConnection, tableSelector }: { hoveredConnection: ConnectionAddress, tableSelector: string }) {
  const input = useAppSelector(state => getPort(state, hoveredConnection.input))
  const output = useAppSelector(state => getPort(state, hoveredConnection.output))
  const inputDeviceId = input.deviceId
  const outputDeviceId = output.deviceId

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
        
        ${tableSelector} td.input-port-id-${input.id}::after {
            opacity: 1;
        }
        
        ${tableSelector} td#port-intersection-${output.id}-${input.id} {
            background-color: var(${input.type === output.type ? '--table-compatible-color' : '--table-incompatible-color'}) !important;
        }
        
        ${tableSelector} #input_port_${input.id}::after,
        ${tableSelector} #input_device_${inputDeviceId || 'unknown_devices'}::after,
        ${tableSelector} #output_device_${outputDeviceId || 'unknown_devices'}::after {
            opacity: 1;
        }

        ${tableSelector} #input_port_${input.id},
        ${tableSelector} #input_device_${inputDeviceId || 'unknown_devices'},
        ${tableSelector} #output_device_${outputDeviceId || 'unknown_devices'} {
            color: var(--foreground-rgb);
        }
        `
      }
    </style>
  )
}