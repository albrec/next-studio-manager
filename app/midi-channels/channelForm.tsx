import { MidiChannelColors, MidiChannelPayload } from "@/lib/features/midiChannels/midiChannelsTypes"
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material"
import { FormEvent, useState } from "react"
import { useAlertsDispatch } from "../state/alertContext"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { Close, Palette } from "@mui/icons-material"
import { getMidiChannel, update } from "@/lib/features/midiChannels/midiChannelsSlice"
import { CirclePicker } from "react-color"

export default function ChannelForm({ channelNumber, open, onClose, onExited }: { channelNumber: number, open: boolean, onClose?(): void, onExited?(): void }) {
  const dispatch = useAppDispatch()
  const alertsDispatch = useAlertsDispatch()
  const channel = useAppSelector(getMidiChannel(channelNumber))
  const [name, setName] = useState(channel?.name || '')
  const [color, setColor] = useState(channel?.color || MidiChannelColors[0])
  const [pickerOpen, setPickerOpen] = useState(false)

  function closeModal() {
    onClose?.()
  }

  function submitForm(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(update({
      name,
      channel: channelNumber,
      color,
    }))
    closeModal()
  }

  return (
    <Dialog open={ open } onClose={ onClose } TransitionProps={{ onExited }}>
      <Box className="p-12">
        <DialogTitle className="pl-0" variant='h2'>MIDI Channel { channelNumber } Assignment</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={ submitForm }>
          <Box className="flex gap-4">
            <TextField
              label="Channel Label"
              placeholder="What is channel for?"
              value={ name }
              onChange={ e => setName(e.target.value) }
              required
              autoFocus
            />
            <IconButton onClick={ () => setPickerOpen(true) }><Palette fontSize="large" htmlColor={ color } /></IconButton>
          </Box>

          <Dialog open={ pickerOpen } onClose={() => setPickerOpen(false) }>
            <DialogTitle><Typography variant="h3">Channel Color</Typography></DialogTitle>
            <DialogContent>
              <CirclePicker
                className="pt-2"
                width="13.5rem"
                color={ color }
                colors={ MidiChannelColors }
                onChangeComplete={ (color) => {
                  setColor(color.hex)
                  setPickerOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
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