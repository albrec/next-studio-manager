import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react"
import { Button, ButtonGroup } from "@mui/material"
import { useAppSelector } from "@/lib/hooks"
import { getDevices } from "@/lib/features/devices/devicesSlice"
import { getConnections } from "@/lib/features/connections/connectionsSlice"
import { PortTypes } from "@/lib/features/ports/portTypes"
import GridTable from "./GridTable"
import { ConnectionAddress } from "@/lib/features/connections/connectionTypes"
import HighlightStyles from "./Highlighter"
import NodeStyles from "./NodeStyles"


const tableSelector = 'table.connection-grid'

const SetHoverContext = createContext<Dispatch<SetStateAction<ConnectionAddress | null>> | null>(null)
export function useSetHover() {
  return useContext(SetHoverContext)
}

export function ConnectionGrid () {
  const devices = useAppSelector(getDevices)
  const connections = useAppSelector(getConnections)
  const [portTypes, setPortTypes] = useState<PortTypes[]>([PortTypes.AUDIO, PortTypes.MIDI, PortTypes.USB])
  const [hoveredConnection, setHoveredConnection] = useState<ConnectionAddress | null>(null)
    
  const connectionMap = useMemo(() => connections?.map(c => c.id), [connections])
    
  return (
    <>
      { hoveredConnection && <HighlightStyles hoveredConnection={ hoveredConnection } tableSelector={ tableSelector } /> }
      <NodeStyles tableSelector={ tableSelector } />
      <ButtonGroup>
        <Button variant={ portTypes.includes(PortTypes.AUDIO) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.AUDIO) }>Audio</Button>
        <Button variant={ portTypes.includes(PortTypes.MIDI) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.MIDI) }>MIDI</Button>
        <Button variant={ portTypes.includes(PortTypes.USB) ? 'contained' : 'outlined' } onClick={ () => toggleFilter(PortTypes.USB) }>USB</Button>
      </ButtonGroup>
      <SetHoverContext.Provider value={ setHoveredConnection }>
        <GridTable portTypes={ portTypes } />
      </SetHoverContext.Provider>
    </>
  )



  function toggleFilter(portType: PortTypes) {
    const newPortType = portTypes.includes(portType) ? portTypes.filter(p => p !== portType) : [...portTypes, portType]
    if(newPortType.length > 0) {
      setPortTypes(newPortType)
    }
  }
}


