'use client'

import { Typography } from "@mui/material"
import ChannelList from "./channelList"

export default function MidiChannels() {
  return (
    <>
      <Typography variant="h1">MIDI Channels</Typography>

      <ChannelList />
    </>
  )
}