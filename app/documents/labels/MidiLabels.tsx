import { DeviceDecorated } from "@/lib/features/devices/deviceTypes"
import { getDecoratedDevice, getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap } from "@/lib/features/midiChannels/midiChannelsSlice"
import { DecoratedPort, PortTypes } from "@/lib/features/ports/portTypes"
import { useAppSelector } from "@/lib/hooks"
import LabelSheet from "../LabelSheet"
import { Box } from "@mui/material"
import "./MidiLabels.css"
import { LabelTypes } from "../labelTypes"

export function MidiLabels({ type, firstIdx, className, labelClick, skipLabels }: { type: string, firstIdx: number, className?: string, labelClick?(args: any): void, skipLabels: string[] }) {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))

  return (
    <LabelSheet className={ className } type={ LabelTypes[type] } firstIdx={ firstIdx } labels={ devices.filter(d => !skipLabels.includes(d.id)).map(d => <MidiLabel device={ d } labelColor={ d.labelColor } labelClick={ () => labelClick?.(d) } key={ d.id } />) } />
  )
}


function MidiLabel({ device, labelColor, labelClick }: { device: DeviceDecorated, labelColor?: string, labelClick?(): void }) {
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



