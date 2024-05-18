import { v4 as uuidv4 } from 'uuid'
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react"
import { useDevicesDispatch } from "../state/deviceContext"
import { Device, MidiChannels } from '../state/descriptions'
import { Box, Button, ButtonGroup, Dialog, DialogTitle, FormControl, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

export default function DeviceForm ({ device, open, onClose }: { device?: Device, open: boolean, onClose(): void }) {
    const [name, setName] = useState(device?.name || '')
    const [midiChannels, setMidiChannels] = useState(device?.midiChannels || [])
    const dispatch = useDevicesDispatch()

    function closeModal() {
        onClose()
    }

    function submitForm(e: FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if(!!device) {
            dispatch?.({
                type: 'update',
                device: {
                    ...device,
                    name,
                    midiChannels,
                }
            })
        } else {
            dispatch?.({
                type: 'add',
                device: {
                    id: uuidv4(),
                    name,
                    ports: [],
                    midiChannels,
                }
            })
        }
        closeModal()
    }

    return (
        <Dialog open={ open } onClose={ onClose }>
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
                { MidiChannels.map(c => 
                    <Button className=" basis-0 grow min-w-0" variant={ midiChannels.includes(c) ? 'contained' : 'outlined' } onClick={ () => toggleMidiChannel(c) } key={ `midi_channel_${c}` }>{ c }</Button>
                ) }
            </ButtonGroup>
        </Box>
    )
}