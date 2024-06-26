import { Device } from "@/lib/features/devices/deviceTypes"
import { Port, PortPayload, PortTypes } from "@/lib/features/ports/portTypes"
import { getPortsByDevice, remove, sortPorts } from "@/lib/features/ports/portsSlice"
import { Add, ArrowDropDown, ContentCopy, Delete, Edit, Piano, Usb, VolumeUp } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Checkbox, IconButton, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import PortForm from "./portForm"
import { useState } from "react"
import DeleteModal from "../components/deleteModal"

export default function PortList({ device }: { device: Device }) {
  const dispatch = useDispatch()
  const ports = useSelector(getPortsByDevice(device.id)).sort(sortPorts)
  const [portModalOpen, setPortModalOpen] = useState(false)
  const [editPort, setEditPort] = useState<PortPayload | null>(null)
  const [portToDelete, setPortToDelete] = useState<Port | null>(null)

  const hasAudio = ports.some(p => p.type === PortTypes.AUDIO)
  const hasMidi = ports.some(p => p.type === PortTypes.MIDI)
  const hasUsb = ports.some(p => p.type === PortTypes.USB)

  return (
    <Accordion className="bg-stone-100">
      <AccordionSummary expandIcon={ <ArrowDropDown /> }>
        <Typography className="mr-4" variant="h4">Ports ({ ports.length })</Typography>
        { ports.length > 0 ?
          <>
            { hasAudio && <VolumeUp /> }
            { hasMidi && <Piano /> }
            { hasUsb && <Usb /> }
          </>
          :
          <Typography variant="body2"><em>No ports assigned</em></Typography>
        }
      </AccordionSummary>
      <AccordionDetails>
        <Box className="flex flex-wrap gap-4">
          { ports.map(port => (
            <Card className="flex flex-col justify-between bg-stone-200" key={ `port_${port.id}` }>
              <CardContent>
                <Typography className="flex items-center" gutterBottom variant="h3">
                  { port.type === PortTypes.AUDIO && <VolumeUp />}
                  { port.type === PortTypes.MIDI && <Piano />}
                  { port.type === PortTypes.USB && <Usb />}
                  { port.name || "Unnamed Port" }
                </Typography>
                <Typography noWrap>Type: { port.type }</Typography>
                { port.type === PortTypes.AUDIO && <Typography noWrap>Sub Type: { port.subType }</Typography> }
                <Typography noWrap>Connector: { port.connector }</Typography>
                { port.type === PortTypes.USB ?
                  <Typography className="flex items-center" noWrap>Host Port: <Checkbox className="ml-2" checked={ port.host } readOnly /></Typography>
                  :
                  <Typography noWrap>IO: { port.io }</Typography>
                }
              </CardContent>
              <CardActions>
                <IconButton onClick={ () => openEditPort(port) }><Edit fontSize="small" /></IconButton>
                <IconButton onClick={ () => setPortToDelete(port) }><Delete fontSize="small" /></IconButton>
                <IconButton onClick={ () => openEditPort(duplicatePort(port)) }><ContentCopy fontSize="small" /></IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </AccordionDetails>


      { editPort &&
        <PortForm
          device={ device }
          port={ editPort }
          open={ portModalOpen }
          onClose={ () => setPortModalOpen(false) }
          onExited={ () => setEditPort(null)}
        />
      }


      <DeleteModal name={ `${device.name} port ${portToDelete ? portToDelete.name : ''}` } open={ !!portToDelete } onDelete={ () => deletePort() } onClose={ () => setPortToDelete(null) } />
    </Accordion>
  )

  function deletePort() {
    if(portToDelete) {
      dispatch(remove(portToDelete.id))
    }
  }

  function openEditPort(port: PortPayload) {
    setEditPort(port)
    setPortModalOpen(true)
  }

  function duplicatePort(port: Port): PortPayload {
    const newPort: PortPayload = { ...port }
    delete newPort.id

    newPort.name = newPort.name.replace(/([L|R]|\d+)$/, (m) => {
      if(m === 'L') {
        return 'R'
      } else if(m === 'R') {
        return 'L'
      } else if(parseInt(m)) {
        return (parseInt(m) + 1).toString()
      } else {
        return m
      }
    })

    return newPort
  }
}