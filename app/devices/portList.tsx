import { Device } from "@/lib/features/devices/deviceTypes"
import { PortTypes } from "@/lib/features/ports/portTypes"
import { getPortsByDevice } from "@/lib/features/ports/portsSlice"
import { Add, ArrowDropDown, Delete, Edit, Piano, Usb, VolumeUp } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Checkbox, IconButton, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import PortForm from "./portForm"
import { useState } from "react"

export default function PortList({ device }: { device: Device }) {
  const ports = useSelector(getPortsByDevice(device.id))
  const [portModalOpen, setPortModalOpen] = useState(false)

  const hasAudio = ports.some(p => p.type === PortTypes.AUDIO)
  const hasMidi = ports.some(p => p.type === PortTypes.MIDI)
  const hasUsb = ports.some(p => p.type === PortTypes.USB)

  return (
    <Accordion className="bg-stone-100">
      <AccordionSummary expandIcon={ <ArrowDropDown /> }>
        <Box className="flex items-center">
          <Box className="flex items-baseline">
            <Typography className="mr-4" variant="h4">Ports</Typography>
            { ports.length > 0 ?
              <>
                { hasAudio && <VolumeUp /> }
                { hasMidi && <Piano /> }
                { hasUsb && <Usb /> }
              </>
              :
              <Typography variant="body2"><em>No ports assigned</em></Typography>
            }
          </Box>
          <IconButton onClick={ e => setPortModalOpen(true) }><Add /></IconButton>
        </Box>
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
                {/* <IconButton onClick={ () => openPortModal(port) }><Edit fontSize="small" /></IconButton>
                <IconButton onClick={ () => setPortDeleteCheck(port) }><Delete fontSize="small" /></IconButton>
                <IconButton onClick={ () => openPortModal(duplicatePort(port)) }><ContentCopy fontSize="small" /></IconButton> */}
              </CardActions>
            </Card>
          ))}
        </Box>
      </AccordionDetails>

      { portModalOpen && <PortForm device={ device } open={ portModalOpen } onClose={ () => setPortModalOpen(false) } /> }
    </Accordion>
  )
}