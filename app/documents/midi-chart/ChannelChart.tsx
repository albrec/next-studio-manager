import { getDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap } from "@/lib/features/midiChannels/midiChannelsSlice"
import { MidiChannelNumbers } from "@/lib/features/midiChannels/midiChannelsTypes"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export default function ChannelChart() {
  const devices = useAppSelector(getDevices)
  const channelMap = useAppSelector(getMidiChannelMap)
  const channels = MidiChannelNumbers.map(cn => {
    const bgColor = channelMap[cn]?.color || 'var(--background-color)'
    const textColor = `hsl(from ${bgColor} h 0 calc((l - 60) * -100))`
    const channelDevices = devices.filter(d => d.midiChannels?.includes(cn)).map(d => d.name)
    return {
      ...channelMap[cn],
      channel: cn,
      devices: channelDevices,
      bgColor,
      textColor,
    }
  })

  return <Card className="max-w-fit channel-chart print-page" elevation={4}>
    <CardContent>
      <Typography variant="h2">Channel Assignments</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Device</TableCell>
            <TableCell align="right">Channel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { channels.map(c =>
            <TableRow key={ c.channel }>
              <TableCell sx={{ bgcolor: c.bgColor, color: c.textColor }}><strong>{ c.devices.join(', ') }</strong> { !!c.name && `(${c.name})` }</TableCell>
              <TableCell sx={{ bgcolor: c.bgColor, color: c.textColor }} align="right">{ c.channel }</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
}
