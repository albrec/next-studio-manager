'use client'

import { Typography } from "@mui/material"
import ChannelList from "./channelList"
import { useAppSelector } from "@/lib/hooks"
import { getDevices } from "@/lib/features/devices/devicesSlice"

export default function MidiChannels() {
  const devices = useAppSelector(getDevices)

  return (
    <>
      <Typography variant="h1">MIDI Channels</Typography>

      <ChannelList />
    </>
  )
}