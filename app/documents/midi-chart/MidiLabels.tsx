import { DeviceDecorated } from "@/lib/features/devices/deviceTypes"
import { getConnectedDevices, getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap, getMidiChannelsById } from "@/lib/features/midiChannels/midiChannelsSlice"
import { PortTypes } from "@/lib/features/ports/portTypes"
import { getConnectedPort, getConnectedPorts } from "@/lib/features/ports/portsSlice"
import { useAppSelector } from "@/lib/hooks"
import { Box, Card, CardContent, Typography } from "@mui/material"

export function MidiLabels() {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))

  return (
    <Card>
      <CardContent>
        <Typography>MIDI Labels</Typography>

        { devices.map(d => 
          <Box className="device-label" key={ d.id }>
            <small>{ d.name }</small>
            <Channels device={ d } />
            <Ports device={ d } />
          </Box>
        )}
      </CardContent>
    </Card>
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
  const connectedDevices = useAppSelector(getConnectedDevices(device))
  return (
    <div>
      <div>Inputs: { connectedDevices.inputDevices.map(d => d?.name).join(', ') }</div>
      <div>Outputs: { connectedDevices.inputDevices.map(d => d?.name).join(', ') }</div>
    </div>
  )
}



