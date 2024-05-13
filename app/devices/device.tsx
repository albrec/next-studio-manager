import { useState } from "react"
import { Device as DeviceType, Port, PortTypes } from "../state/descriptions"
import { useDevicesDispatch } from "../state/deviceContext"
import PortForm from "./portForm"
import classNames from "classnames"
import DeviceForm from "./deviceForm"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Checkbox, Divider, IconButton, Paper, Typography } from "@mui/material"
import { Add, ArrowDropDown, Delete, Edit, Piano, Usb, VolumeUp } from "@mui/icons-material"

export default function Device ({ device }: { device: DeviceType }) {
    const dispatch = useDevicesDispatch()
    const [deviceModalOpen, setDeviceModalOpen] = useState(false)
    const [portModalOpen, setPortModalOpen] = useState(false)
    const [editPort, setEditPort] = useState<Port | null>(null)

    const hasAudio = device.ports.some(p => p.type === PortTypes.AUDIO)
    const hasMidi = device.ports.some(p => p.type === PortTypes.MIDI)
    const hasUsb = device.ports.some(p => p.type === PortTypes.USB)

    function openPortModal(port?: Port) {
        setEditPort(port ? port : null)
        setPortModalOpen(true)
    }

    function closePortModal() {
        setEditPort(null)
        setPortModalOpen(false)
    }

    function sortPorts(ports: Port[]) {
        return ports.sort((a,b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    }

    return (
        <section>
            <Paper className="p-8 mb-8" elevation={ 3 }>
            
                <Box className="flex items-center mb-4">
                    <Typography className="mr-4" variant="h2">{ device.name } </Typography>
                    <ButtonGroup>
                        <Button onClick={ e => { setDeviceModalOpen(true) } }><Edit /></Button>
                        <Button onClick={e => dispatch?.({ type: 'delete', id: device.id })}><Delete /></Button>
                        <Button onClick={ e => openPortModal() }>Add Port <Add /></Button>
                    </ButtonGroup>
            
                </Box>
            
                { deviceModalOpen && <DeviceForm device={ device } open={ deviceModalOpen } onClose={ () => setDeviceModalOpen(false) } /> }
                <Accordion className="bg-stone-100">
                    <AccordionSummary expandIcon={ <ArrowDropDown /> }>
                        <Typography className="mr-4" variant="h4">Ports</Typography>
            
                        { device.ports.length > 0 ?
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
                            { device.ports && sortPorts(device.ports).map(port => (
                                <Card className="bg-stone-200 p-4" key={ `port_${port.id}` }>
                                    <CardContent>
                                        <Typography gutterBottom variant="h3">{ port.name || "Unnamed Port" }</Typography>
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
                                        <IconButton onClick={ e => { openPortModal(port) } }><Edit /></IconButton>
                                        <IconButton onClick={ e => dispatch?.({ type: 'deletePort', id: device.id, portId: port.id }) }><Delete /></IconButton>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            
                { portModalOpen && <PortForm port={ editPort } device={ device } open={ portModalOpen } onClose={ closePortModal } /> }
            </Paper>
        </section>
    )
}