import { v4 as uuidv4 } from 'uuid'
import { FormEvent, useState } from "react"
import { useDevicesDispatch } from "../state/deviceContext"
import { AudioPort, AudioPortSubTypes, MidiPort, NewPort, Port, PortConnectors, PortDirectionality, PortTypes,  UsbPort } from '../state/descriptions'
import classNames from 'classnames'
import { Box, Button, Checkbox, Dialog, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Close } from '@mui/icons-material'
import { Device } from '@/lib/features/devices/deviceTypes'
import { useDispatch } from 'react-redux'
import { AudioPortPayload, MidiPortPayload, PortPayload, UsbPortPayload } from '@/lib/features/ports/portTypes'
import { addPort, update, upsert } from '@/lib/features/ports/portsSlice'

export default function PortForm ({ port, device, open, onClose, onExited }: { port?: Port | null, device: Device, open: boolean, onClose?(): void, onExited?(): void }) {
  const [name, setName] = useState(port?.name || '')
  const [type, setType] = useState(port?.type || '')
  const [subType, setSubType] = useState(port?.type === PortTypes.AUDIO && port?.subType ? port.subType : '')
  const [connector, setConnector] = useState(port?.connector || '')
  const [io, setIo] = useState(port?.io || '')
  const [host, setHost] = useState(port?.type === PortTypes.USB && port?.host ? port.host : false)
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useDispatch()

  const isNewPort = !port?.id

  function closeModal() {
    onClose?.()
  }

  return (
    <Dialog open={ open } onClose={ onClose } TransitionProps={{ onExited }}>
      <Box className="p-12">
        <form
          onSubmit={ submitForm }
          noValidate
        >
          <Box className="flex flex-col gap-3">
            <DialogTitle className="pl-0" variant="h3">{ isNewPort ? 'Add' : 'Update' } Port</DialogTitle>
            <TypeSelect />

            { (type === PortTypes.USB ) ?
              <FormControlLabel control={ <Checkbox onChange={ e => setHost(!host) } checked={ host } /> } label="USB Host Port" />
              :
              !!type && <IoSelect />
            }


            { !!type && type === PortTypes.AUDIO && <SubTypeSelect /> }


            { !!type && (type === PortTypes.MIDI || type === PortTypes.USB || (type === PortTypes.AUDIO && !!subType)) && <ConnectorSelect /> }

            <TextField
              label=" Port Name "
              placeholder="Name of port"
              value={ name || deriveName() }
              onChange={ e => setName(e.target.value) }
              required
              error={ submitted && !(name || deriveName()) }
            />

            <Button variant="contained" onClick={ submitForm }>{ isNewPort ? 'Add' : 'Update' }</Button>
          </Box>
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


  function TypeSelect () {
    const [blurred, setBlurred] = useState(false)
    const label = "Port Type"

    return (
      <FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
          label={ label }
          onChange={ e => setType(e.target.value as PortTypes) }
          onBlur={ e => setBlurred(true) }
          value={ type }
          error={ (submitted || blurred) && !type }
        >
          <MenuItem value={ PortTypes.AUDIO }>{ PortTypes.AUDIO }</MenuItem>
          <MenuItem value={ PortTypes.MIDI }>{ PortTypes.MIDI }</MenuItem>
          <MenuItem value={ PortTypes.USB }>{ PortTypes.USB }</MenuItem>
        </Select>
      </FormControl>
    )
  }


  function SubTypeSelect () {
    const [blurred, setBlurred] = useState(false)
    const label = "Audio Connection Type"

    return (
      <FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
          label={ label }
          onChange={ e => setSubType(e.target.value as AudioPortSubTypes) }
          onBlur={ e => setBlurred(true) }
          value={ subType }
          error={ (submitted || blurred) && !subType }
        >
          <MenuItem value={ AudioPortSubTypes.BALANCED }>{ AudioPortSubTypes.BALANCED }</MenuItem>
          <MenuItem value={ AudioPortSubTypes.UNBALANCED }>{ AudioPortSubTypes.UNBALANCED }</MenuItem>
          <MenuItem value={ AudioPortSubTypes.STEREO }>{ AudioPortSubTypes.STEREO }</MenuItem>
        </Select>
      </FormControl>
    )
  }


  function ConnectorSelect () {
    const [blurred, setBlurred] = useState(false)
    const subTypeSelected = !!subType
    let connectors
    
    switch(type) {
    case PortTypes.AUDIO: {
      connectors = subType === AudioPortSubTypes.UNBALANCED ? [PortConnectors.TR, PortConnectors.MINI_TS] : [PortConnectors.TRS, PortConnectors.MINI_TRS]
      break
    }
    case PortTypes.MIDI: {
      connectors = [PortConnectors.DIN, PortConnectors.TRS]
      break
    }
    case PortTypes.USB: {
      connectors = !!host ? [PortConnectors.USB_A, PortConnectors.USB_C] : [PortConnectors.USB_B, PortConnectors.USB_C, PortConnectors.USB_MINI, PortConnectors.USB_MICRO]
      break
    }
    }
    const label = "Connector"
        
    return (
      <FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
          label={ label }
          onChange={ e => setConnector(e.target.value) }
          onBlur={ e => setBlurred(true) }
          value={ connector }
          error={ (submitted || blurred) && !connector }
        >
          { connectors?.map(connector => (
            <MenuItem key={ `connector_${connector}`} value={ connector }>{ connector }</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }



  function IoSelect () {
    const [blurred, setBlurred] = useState(false)
    const typeSelected = !!type
    let directions
    
    switch(type) {
    case PortTypes.AUDIO: {
      directions = [PortDirectionality.INPUT, PortDirectionality.OUTPUT]
      break
    }
    case PortTypes.MIDI: {
      directions = [PortDirectionality.INPUT, PortDirectionality.OUTPUT]
      break
    }
    case PortTypes.USB: {
      directions = [PortDirectionality.BIDIRECTIONAL]
      break
    }
    }
    const label = "Signal Direction"
        
    return (
      <FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
          label={ label }
          onChange={ e => setIo(e.target.value as PortDirectionality) }
          onBlur={ e => setBlurred(true) }
          value={ io }
          error={ (submitted || blurred) && !io }
        >
          { directions?.map(direction => (
            <MenuItem key={ `direction_${direction}`} value={ direction }>{ direction }</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  function deriveName() {
    if(type === PortTypes.USB) {
      return `USB ${host ? 'Host' : ''}`
    } else {
      return type && io ? `${type} ${io}` : ''
    }
  }



  function portIsValid(port: PortPayload) {
    if(port.type === PortTypes.AUDIO && port.subType && port.io && port.connector && port.name) {
      return true
    } else if(port.type === PortTypes.MIDI && port.io && port.connector && port.name) {
      return true
    } else if(port.type === PortTypes.USB && port.connector && port.name) {
      return true
    } else {
      return false
    }
  }



  function submitForm(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    let p = {
      name: name || deriveName(),
      type,
      connector,
      io,
    } as PortPayload
    switch(type) {
    case PortTypes.USB: {
      p = {
        ...p,
        io: PortDirectionality.BIDIRECTIONAL,
        host,
      } as UsbPortPayload
      break
    }
    case PortTypes.AUDIO: {
      p = {
        ...p,
        subType,
      } as AudioPortPayload
      break
    }
    case PortTypes.MIDI: {
      p = {
        ...p,
      } as MidiPortPayload
      break
    }
    }
    if (portIsValid(p)) {
      if(port) {
        dispatch(update({
          id: port.id,
          changes: p,
        }))
      } else {
        dispatch(addPort(device.id, p))
      }
      closeModal()
    }
    setSubmitted(true)
  }
    
}






