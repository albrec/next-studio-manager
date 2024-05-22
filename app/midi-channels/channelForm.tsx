import { MidiChannelPayload } from "@/lib/features/midiChannels/midiChannelsTypes"
import { Box, Button, Dialog, DialogTitle, IconButton, TextField } from "@mui/material"
import { FormEvent, useState } from "react"
import { useAlertsDispatch } from "../state/alertContext"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { Close } from "@mui/icons-material"
import { getMidiChannel, update } from "@/lib/features/midiChannels/midiChannelsSlice"

export default function ChannelForm({ channelNumber, open, onClose, onExited }: { channelNumber: number, open: boolean, onClose?(): void, onExited?(): void }) {
  const dispatch = useAppDispatch()
  const alertsDispatch = useAlertsDispatch()
  const channel = useAppSelector(getMidiChannel(channelNumber))
  const [name, setName] = useState(channel?.name || '')

  function closeModal() {
    onClose?.()
  }

  function submitForm(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(update({
      name,
      channel: channelNumber,
    }))
    closeModal()
  }

  return (
    <Dialog open={ open } onClose={ onClose } TransitionProps={{ onExited }}>
      <Box className="p-12">
        <DialogTitle className="pl-0" variant='h2'>MIDI Channel { channelNumber } Assignment</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={ submitForm }>
          <TextField
            label="Channel Label"
            placeholder="What is channel for?"
            value={ name }
            onChange={ e => setName(e.target.value) }
            required
            autoFocus
          />
          <Button variant="contained" size="large" onClick={ submitForm }>{ !!channel ? 'Update' : 'Add' }</Button>
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