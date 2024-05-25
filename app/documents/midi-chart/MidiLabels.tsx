import { DeviceDecorated } from "@/lib/features/devices/deviceTypes"
import { getConnectedDevices, getDecoratedDevice, getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap, getMidiChannelsById } from "@/lib/features/midiChannels/midiChannelsSlice"
import { PortTypes } from "@/lib/features/ports/portTypes"
import { getConnectedPort, getConnectedPorts, getDecoratedPort } from "@/lib/features/ports/portsSlice"
import { useAppSelector } from "@/lib/hooks"
import { Box, Card, CardContent, Typography } from "@mui/material"
import LabelSheet, { LabelTypes } from "../LabelSheet"

export function MidiLabels() {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))

  return (
    <Box>
      {/* <Typography>MIDI Labels</Typography> */}

      <LabelSheet type={ LabelTypes.Avery5160 } labels={ devices.map(d => <MidiLabel device={ d } key={ d.id } />) } />
    </Box>
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



