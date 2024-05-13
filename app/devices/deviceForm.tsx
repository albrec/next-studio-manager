import { v4 as uuidv4 } from 'uuid'
import { FormEvent, useEffect, useRef, useState } from "react"
import { useDevicesDispatch } from "../state/deviceContext"
import { Device } from '../state/descriptions'
import { Box, Button, Dialog, DialogTitle, FormControl, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

export default function DeviceForm ({ device, open, onClose }: { device?: Device, open: boolean, onClose(): void }) {
    const [name, setName] = useState(device?.name || '')
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
                }
            })
        } else {
            dispatch?.({
                type: 'add',
                device: {
                    id: uuidv4(),
                    name,
                    ports: []
                }
            })
        }
        closeModal()
    }

    return (
        <Dialog open={ open } onClose={ onClose }>
            <Box className="p-12">
                <DialogTitle className="pl-0" variant='h2'>{ !!device ? 'Update' : 'Add' } Device</DialogTitle>
                <form className="flex items-center gap-2" onSubmit={ submitForm }>
                    <TextField
                        label="Name"
                        placeholder="Name of device"
                        value={ name }
                        onChange={ e => setName(e.target.value) }
                        required
                        autoFocus
                    />
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
