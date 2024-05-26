import { Device, DeviceDecorated } from "@/lib/features/devices/deviceTypes"
import { getDecoratedDevice, getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap } from "@/lib/features/midiChannels/midiChannelsSlice"
import { DecoratedPort, Port, PortTypes } from "@/lib/features/ports/portTypes"
import { useAppSelector } from "@/lib/hooks"
import LabelSheet, { LabelTypes } from "../LabelSheet"
import { Box } from "@mui/material"
import "./MidiLabels.css"

export function MidiLabels({ type }: { type: string }) {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))

  return (
    <LabelSheet type={ type } labels={ devices.map(d => <MidiLabel device={ d } labelColor={ d.labelColor } key={ d.id } />) } />
  )
}


function MidiLabel({ device, labelColor }: { device: DeviceDecorated, labelColor?: string }) {
  return (
    <Box className="midi-label">
      <small>{ device.name }</small>
      <Channels device={ device } />
      <DeviceConnections device={ device } />
    </Box>
  )
}


function Channels({ device }: { device: DeviceDecorated}) {
  const midiChannels = useAppSelector(getMidiChannelMap)
  const channels = (device.midiChannels || []).map(c => ({ ...midiChannels[c], channel: c }))

  return channels.length ? (
    <Box className="device-channels">
      <small>Ch:</small> { channels.map((c, i) => 
        <Channel channel={ c } key={ c.channel } />
      )}
    </Box>
  ) : null
}

function Channel({ channel }: { channel: any }) {
  return (
    <span className="channel">
      <strong>{ channel.channel }</strong>
      { channel.name && 
        <span> ({ channel.name })</span>
      }
    </span>
  )
}


function DeviceConnections({ device }: { device: DeviceDecorated}) {
  const connectionTypes = [PortTypes.MIDI, PortTypes.USB]
  const decoratedDevice = useAppSelector(getDecoratedDevice(device))
  const inputPorts = decoratedDevice.inputs.filter(p => connectionTypes.includes(p.type) && p.connectedDevice)
  const outputPorts = decoratedDevice.outputs.filter(p => connectionTypes.includes(p.type) && p.connectedDevice)

  return (
    <Box className="port-connections">
      { !!inputPorts.length && <Box className="inputs"><small>Inputs:</small> { inputPorts.map((p, i) => <PortName port={ p } key={ i } />) }</Box> }
      { !!outputPorts.length && <Box className="outputs"><small>Outputs:</small> { outputPorts.map((p, i) => <PortName port={ p } key={ i} />) }</Box> }
    </Box>
  )
}

function PortName({ port }: { port: DecoratedPort | undefined }) {
  return port && port.connectedPort ? (
    <span className="port">{ port.connectedDevice?.name } { port.connectedPort.name }</span>
  ) : null
}



