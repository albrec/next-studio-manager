'use client'
import { Box, Typography } from "@mui/material"
import Head from "next/head"
import "./print.css"
import ChannelChart from "./ChannelChart"

export default function MIDIChart() {
  

  return (
    <>
      <Head>
        <title>MIDI Charts</title>  
      </Head>

      <Typography variant="h1" gutterBottom>MIDI Charts</Typography>

      <Box className="print-pages">

        <ChannelChart />
      </Box>

    </>
  )
}