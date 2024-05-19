import { Dispatch, SetStateAction, useState } from "react"
import { useDevicesDispatch } from "../state/deviceContext"
// import PortForm from "./portForm"
import classNames from "classnames"
import DeviceForm from "./deviceForm"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Paper, Stack, Typography } from "@mui/material"
import { Add, ArrowDropDown, Delete, Edit, Piano, Usb, VolumeUp, ContentCopy } from "@mui/icons-material"
import { useAlertsDispatch } from "../state/alertContext"
import DeleteModal from "../components/deleteModal"
import { Device } from "@/lib/features/devices/deviceTypes"
import { remove } from "@/lib/features/devices/devicesSlice"
import { useDispatch } from "react-redux"
import PortList from "./portList"

export default function DeviceComponent ({ device }: { device: Device }) {
  const dispatch = useDispatch()
  const alertsDispatch = useAlertsDispatch()
  const [deviceModalOpen, setDeviceModalOpen] = useState(false)
  // const [portModalOpen, setPortModalOpen] = useState(false)
  // const [editPort, setEditPort] = useState<Port | NewPort | null>(null)
  const [deviceDeleteCheck, setDeviceDeleteCheck] = useState(false)
  // const [portDeleteCheck, setPortDeleteCheck] = useState<Port | false>(false)

  // const hasAudio = device.ports.some(p => p.type === PortTypes.AUDIO)
  // const hasMidi = device.ports.some(p => p.type === PortTypes.MIDI)
  // const hasUsb = device.ports.some(p => p.type === PortTypes.USB)

  // function openPortModal(port?: Port | NewPort) {
  //   setEditPort(port ? port : null)
  //   setPortModalOpen(true)
  // }

  // function closePortModal() {
  //   setEditPort(null)
  //   setPortModalOpen(false)
  // }

  function deleteDevice() {
    dispatch(remove(device.id))
    alertsDispatch?.({
      type: 'add',
      alert: {
        severity: "info",
        msg: `Device deleted ${device.name}`,
        transient: true,
      }
    })
  }

  // function sortPorts(ports: Port[]) {
  //   return ports.sort((a,b) => {
  //     const matcher = /(.+?)(\d+)$/
  //     const aSegments = a.name.match(matcher)
  //     const aName = aSegments?.[1] || ''
  //     const aNumber = parseInt(aSegments?.[2] || '')
  //     const bSegments = b.name.match(matcher)
  //     const bName = bSegments?.[1] || ''
  //     const bNumber = parseInt(bSegments?.[2] || '')
  //     return a.type.localeCompare(b.type) || aName.localeCompare(bName) || aNumber - bNumber
  //   })
  // }

  // function duplicatePort(port: Port) {
  //   const newPort: NewPort = { ...port }
  //   delete newPort.id

  //   newPort.name = newPort.name.replace(/([L|R]|\d+)$/, (m) => {
  //     if(m === 'L') {
  //       return 'R'
  //     } else if(m === 'R') {
  //       return 'L'
  //     } else if(parseInt(m)) {
  //       return (parseInt(m) + 1).toString()
  //     } else {
  //       return m
  //     }
  //   })

  //   return newPort
  // }

  // function deletePort(port: Port) {
  //   dispatch?.({ type: 'deletePort', id: device.id, portId: port.id })
  // }

  return (
    <section>
      <Paper className="p-8 mb-8" elevation={ 3 }>

        { deviceModalOpen && <DeviceForm device={ device } open={ deviceModalOpen } onClose={ () => setDeviceModalOpen(false) } /> }
        { deviceDeleteCheck && <DeleteModal name={ device.name } open={ deviceDeleteCheck } onDelete={ deleteDevice } onClose={ setDeviceDeleteCheck } /> }
        {/* { portDeleteCheck && <DeleteModal name={ `${device.name} port ${portDeleteCheck?.name}` } open={ !!portDeleteCheck } onDelete={ () => deletePort(portDeleteCheck) } onClose={ setPortDeleteCheck } /> } */}
            
        <Box className="flex justify-between items-center w-full mb-4">
          <Box className="flex items-baseline gap-4">
            <Typography variant="h2">{ device.name }</Typography>
            { Array.isArray(device.midiChannels) && device.midiChannels.length > 0 && (
              <>
                <Divider orientation="vertical" flexItem /> 
                <strong>MIDI Channels: </strong>
                <Stack direction="row" spacing={ 1 } divider={ <Divider orientation="vertical" flexItem />}>
                  { device.midiChannels.map(c => <Typography key={ c }>{ c }</Typography>) }
                </Stack>
              </>
            )}
          </Box>
          <ButtonGroup className="justify-self-end">
            <Button onClick={ e => { setDeviceModalOpen(true) } }><Edit /></Button>
            <Button onClick={ e => setDeviceDeleteCheck(true) }><Delete /></Button>
            {/* <Button onClick={ e => openPortModal() }>Add Port <Add /></Button> */}
          </ButtonGroup>
            
        </Box>
            
        <PortList device={ device } />
            
        {/* { portModalOpen && <PortForm port={ editPort } device={ device } open={ portModalOpen } onClose={ closePortModal } /> } */}
      </Paper>
    </section>
  )
}