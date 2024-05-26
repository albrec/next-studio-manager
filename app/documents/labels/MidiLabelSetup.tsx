import { DeviceDecorated } from "@/lib/features/devices/deviceTypes"
import { getDecoratedDevice, getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap } from "@/lib/features/midiChannels/midiChannelsSlice"
import { PortTypes } from "@/lib/features/ports/portTypes"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material"
import { DefaultLabelType, LabelTypes } from "../LabelSheet"
import { useState } from "react"
import { MidiLabels } from "./MidiLabels"

export default function MidiLabelSetup() {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))
  const [labelType, setLabelType] = useState<string>(DefaultLabelType)

  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h3" gutterBottom>MIDI Setup</Typography>

          <FormControl>
            <InputLabel>Label Type</InputLabel>
            <Select
              label="Label Type"
              value={ labelType }
              onChange={ (e) => setLabelType(e.target.value) }
            >
              { Object.values(LabelTypes).map(label =>
                <MenuItem value={ label } key={ label }>{ label }</MenuItem>
              )}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <MidiLabels type={ labelType } />
    </>
  )
}


function MidiLabel({ device }: { device: DeviceDecorated }) {
  return (
    <>
      <small>{ device.name }</small>
      <Channels device={ device } />
      <Ports device={ device } />
    </>
  )
}


function Channels({ device }: { device: DeviceDecorated}) {
  const midiChannels = useAppSelector(getMidiChannelMap)
  const channels = (device.midiChannels || []).map(c => ({ ...midiChannels[c], channel: c }))

  return channels.length ? (
    <div>
      Ch: { channels.map((c, i) => 
        <>
          { i > 0 && ', '}
          <strong>{ c.channel } </strong>
          { c.name && <span>({ c.name })</span> }
        </>  
      )}
    </div>
  ) : null
}


function Ports({ device }: { device: DeviceDecorated}) {
  const decoratedDevice = useAppSelector(getDecoratedDevice(device))
  const inputDevices = decoratedDevice.inputs.filter(p => p.type === PortTypes.MIDI && p.connectedDevice).map(p => p.connectedDevice)
  const outputDevices = decoratedDevice.outputs.filter(p => p.type === PortTypes.MIDI && p.connectedDevice).map(p => p.connectedDevice)

  return (
    <div>
      { !!inputDevices.length && <span>Inputs: <strong>{ inputDevices.map(d => d?.name).join(', ') }</strong></span> }
      { !!outputDevices.length && <span> | Outputs: <strong>{ outputDevices.map(d => d?.name).join(', ') }</strong></span> }
    </div>
  )
}



