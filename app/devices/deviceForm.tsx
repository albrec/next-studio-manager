import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { Box, Button, ButtonGroup, Dialog, DialogTitle, IconButton, InputLabel, TextField } from '@mui/material'
import { Close } from '@mui/icons-material'
import { useAlertsDispatch } from '../state/alertContext'
import { useDispatch } from 'react-redux'
import { upsert } from '@/lib/features/devices/devicesSlice'
import { Device } from '@/lib/features/devices/deviceTypes'
import { MidiChannelNumbers } from '@/lib/features/midiChannels/midiChannelsTypes'

export default function DeviceForm ({ device, open, onClose, onExited }: { device?: Device, open: boolean, onClose?(): void, onExited?(): void }) {
  const [name, setName] = useState(device?.name || '')
  const [midiChannels, setMidiChannels] = useState(device?.midiChannels || [])
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
          <TextField
            label="Name"
            placeholder="Name of device"
            value={ name }
            onChange={ e => setName(e.target.value) }
            required
            autoFocus
          />
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