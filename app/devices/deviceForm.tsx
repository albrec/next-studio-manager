import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { Box, Button, ButtonGroup, Dialog, DialogContent, DialogTitle, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import { Close, Palette } from '@mui/icons-material'
import { useAlertsDispatch } from '../state/alertContext'
import { useDispatch } from 'react-redux'
import { upsert } from '@/lib/features/devices/devicesSlice'
import { Device, DeviceColors } from '@/lib/features/devices/deviceTypes'
import { MidiChannelNumbers } from '@/lib/features/midiChannels/midiChannelsTypes'
import { CirclePicker } from 'react-color'

export default function DeviceForm ({ device, open, onClose, onExited }: { device?: Device, open: boolean, onClose?(): void, onExited?(): void }) {
  const [name, setName] = useState(device?.name || '')
  const [midiChannels, setMidiChannels] = useState(device?.midiChannels || [])
  const [deviceColor, setDeviceColor] = useState(device?.color || DeviceColors[0])
  const [pickerOpen, setPickerOpen] = useState(false)
  const dispatch = useDispatch()
  const alertsDispatch = useAlertsDispatch()

  function closeModal() {
    onClose?.()
  }

  function submitForm(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(upsert({
      id: device?.id,
      name,
      color: deviceColor,
      midiChannels,
      portIds: device?.portIds || [],
    }))
    closeModal()
  }

  return (
    <Dialog open={ open } onClose={ onClose } TransitionProps={{ onExited }}>
      <Box className="p-12">
        <DialogTitle className="pl-0" variant='h2'>{ !!device ? 'Update' : 'Add' } Device</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={ submitForm }>
          <Box className="flex gap-4">
            <TextField
              className="grow"
              label="Name"
              placeholder="Name of device"
              value={ name }
              onChange={ e => setName(e.target.value) }
              required
              autoFocus
            />
            <IconButton onClick={ () => setPickerOpen(true) }><Palette fontSize="large" htmlColor={ deviceColor } /></IconButton>
          </Box>
          <Dialog open={ pickerOpen } onClose={() => setPickerOpen(false) }>
            <DialogTitle><Typography variant="h3">Device Color</Typography></DialogTitle>
            <DialogContent>
              <CirclePicker
                className="pt-2"
                width="13.5rem"
                color={ deviceColor }
                colors={ DeviceColors }
                onChangeComplete={ (color) => {
                  setDeviceColor(color.hex)
                  setPickerOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
          <MidiButtons midiChannels={ midiChannels } setMidiChannels={ setMidiChannels } />
          <Button variant="contained" size="large" onClick={ submitForm }>{ !!device ? 'Update' : 'Add' }</Button>
        </form>
      </Box>
      <IconButton
        className="absolute top-2 right-2" 
        size="small" 
        aria-label="close"
        onClick={ closeModal }
      >
        <Close />
      </IconButton>
    </Dialog>
  )
}


function MidiButtons({ midiChannels = [], setMidiChannels }: { midiChannels?: number[], setMidiChannels: Dispatch<SetStateAction<number[]>> }) {

  function toggleMidiChannel(midiChannel: number) {
    if(midiChannels.includes(midiChannel)) {
      setMidiChannels(midiChannels.filter(c => c !== midiChannel))
    } else {
      setMidiChannels([...midiChannels, midiChannel])
    }
  }
    

  return (
    <Box>
      <InputLabel>MIDI Channels</InputLabel>
      <ButtonGroup className="flex w-full" size="small">
        { MidiChannelNumbers.map(c => 
          <Button className=" basis-0 grow min-w-0" variant={ midiChannels.includes(c) ? 'contained' : 'outlined' } onClick={ () => toggleMidiChannel(c) } key={ `midi_channel_${c}` }>{ c }</Button>
        ) }
      </ButtonGroup>
    </Box>
  )
}