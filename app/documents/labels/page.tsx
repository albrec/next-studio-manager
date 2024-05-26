'use client'
import { Box, Typography } from "@mui/material"
import Head from "next/head"
import "./page.css"
import { MidiLabels } from "./MidiLabels"
import MidiLabelSetup from "./MidiLabelSetup"

export default function MIDIChart() {
  

  return (
    <>
      <Head>
        <title>Labels</title>  
      </Head>

      <Typography variant="h1" gutterBottom>Labels</Typography>

      <MidiLabelSetup />

    </>
  )
}