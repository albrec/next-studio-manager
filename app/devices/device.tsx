import { useState } from "react"
import DeviceForm from "./deviceForm"
import { Box, Button, ButtonGroup, Divider, Paper, Stack, Typography } from "@mui/material"
import { Add, Delete, Edit, } from "@mui/icons-material"
import { useAlertsDispatch } from "../state/alertContext"
import DeleteModal from "../components/deleteModal"
import { Device } from "@/lib/features/devices/deviceTypes"
import { remove } from "@/lib/features/devices/devicesSlice"
import { useDispatch } from "react-redux"
import PortList from "./portList"
import PortForm from "./portForm"

export default function DeviceComponent ({ device }: { device: Device }) {
  const dispatch = useDispatch()
  const alertsDispatch = useAlertsDispatch()
  const [deviceModalOpen, setDeviceModalOpen] = useState(false)
  const [editDevice, setEditDevice] = useState<Device | null>(null)
  const [portModalOpen, setPortModalOpen] = useState<boolean | 'closing'>(false)
  const [deviceDeleteCheck, setDeviceDeleteCheck] = useState(false)
  const bgcolor = device.color || '#ccc'
  const color = `hsl(from ${bgcolor} h 0 calc((l - .6) * -100))`


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


  return (
    <section>
      <Paper sx={{ bgcolor, color }} className="p-8 mb-8" elevation={ 3 }>

        
        { deviceDeleteCheck && <DeleteModal name={ device.name } open={ deviceDeleteCheck } onDelete={ deleteDevice } onClose={ setDeviceDeleteCheck } /> }
            
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
            <Button variant="contained" onClick={ () => { openEditDevice(device) } }><Edit /></Button>
            <Button variant="contained" onClick={ () => setDeviceDeleteCheck(true) }><Delete /></Button>
            <Button variant="contained" onClick={ () => setPortModalOpen(true) }>Add Port <Add /></Button>
          </ButtonGroup>
            
        </Box>
            
        <PortList device={ device } />

        { editDevice && <DeviceForm device={ device } open={ deviceModalOpen } onClose={ () => setDeviceModalOpen(false) } onExited={ () => setEditDevice(null) } /> }
        
        { portModalOpen &&
          <PortForm
            device={ device }
            open={ portModalOpen === true }
            onClose={ () => setPortModalOpen('closing') }
            onExited={ () => setPortModalOpen(false) }
          />
        }
        
      </Paper>
    </section>
  )

  function openEditDevice(device: Device) {
    setDeviceModalOpen(true)
    setEditDevice(device)
  }
}