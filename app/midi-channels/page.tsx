'use client'

import { Typography } from "@mui/material"
import { useDevices } from "../state/deviceContext"
import ChannelList from "./channelList"

export default function MidiChannels() {
  const devices = useDevices()

  return (
    <>
      <Typography variant="h1">MIDI Channels</Typography>

      <ChannelList />
    </>
  )
}