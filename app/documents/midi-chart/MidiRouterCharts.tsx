import { Device } from "@/lib/features/devices/deviceTypes"
import { getDecoratedDevice, getDevices } from "@/lib/features/devices/devicesSlice"
import { getPortsByDevice, sortPorts } from "@/lib/features/ports/portsSlice"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export default function MidiRouterCharts() {
  const devices = useAppSelector(getDevices)
  const routers = devices.filter(d => d.midiRouter)

  return routers.map(d => <MidiRouterChart device={ d } key={d.id} />)
}

function MidiRouterChart({ device }: { device: Device }) {
  const decoratedDevice = useAppSelector(getDecoratedDevice(device))
  const connectedInputDevices = decoratedDevice.inputs.map(p => p.connectedDevice).filter(d => !!d)
  const connectedOutputDevices = decoratedDevice.outputs.map(p => p.connectedDevice).filter(d => !!d)
  const connectedDevices = connectedOutputDevices.reduce((acc, d) => {
    if(d && acc.map(i => i?.id).includes(d.id)) {
      return acc
    } else {
      return acc.concat(d)
    }
  }, connectedInputDevices)

  return (
    <Card className="max-w-fit channel-chart print-page" elevation={4}>
      <CardContent>
        <Typography variant="h2">{ device.name } MIDI Router</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Device</TableCell>
              <TableCell align="right">Input Port</TableCell>
              <TableCell align="right">Output Port</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { connectedDevices.map(d => 
              <TableRow key={ d?.id }>
                <TableCell sx={{ bgcolor: d?.color }} />
                <TableCell>{ d?.name }</TableCell>
                <TableCell>{ decoratedDevice.inputs.find(p => p.connectedDevice === d)?.name }</TableCell>
                <TableCell>{ decoratedDevice.outputs.find(p => p.connectedDevice === d)?.name }</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
