'use client'
import { getDevices } from "@/lib/features/devices/devicesSlice"
import { getMidiChannelMap } from "@/lib/features/midiChannels/midiChannelsSlice"
import { MidiChannelNumbers } from "@/lib/features/midiChannels/midiChannelsTypes"
import { useAppSelector } from "@/lib/hooks"
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import Head from "next/head"
import "./print.css"

export default function MIDIChart() {
  const devices = useAppSelector(getDevices)
  const channelMap = useAppSelector(getMidiChannelMap)
  const channels = MidiChannelNumbers.map(cn => {
    const bgColor = channelMap[cn]?.color || 'var(--background-color)'
    const textColor = `hsl(from ${bgColor} h 0 calc((l - .6) * -100))`
    const channelDevices = devices.filter(d => d.midiChannels?.includes(cn)).map(d => d.name)
    return {
      ...channelMap[cn],
      channel: cn,
      devices: channelDevices,
      bgColor,
      textColor,
    }
  })

  return (
    <>
      <Head>
        <title>MIDI Chart</title>  
      </Head>

      <Typography variant="h1">MIDI Chart</Typography>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.400' }}>
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
    </>
  )
}
