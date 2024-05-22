import { getConnections } from "@/lib/features/connections/connectionsSlice"
import { useAppSelector } from "@/lib/hooks"

export default function ConnectionNodeStyle({ tableSelector }: { tableSelector: string }) {
  const connections = useAppSelector(getConnections)
  return (
    <style>
      { connections?.map(c => 
        `
        ${tableSelector} td.input-port-id-${c.input},
        ${tableSelector} td.output-port-id-${c.output} {
          background-color: rgb(from var(--mui-palette-secondary-dark) r g b / 0.3) !important;
        }
        
        ${tableSelector} th#input_port_${c.input},
        ${tableSelector} th#output_port_${c.output} {
          background-color: var(--table-header-connected) !important;
        }

        ${tableSelector} tbody td#port-intersection-${c.output}-${c.input} > svg {
          display: block;
        }

        ${tableSelector} tbody td#port-intersection-${c.output}-${c.input}::after {
          background-color: var(--mui-palette-primary-main) !important;
          opacity: 1;
        }
        `
      )}
    </style>
  )
}