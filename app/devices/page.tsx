"use client"

import Head from "next/head"

import DevicesList from "./devicesList"
import DeviceForm from "./deviceForm"
import { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { Add } from "@mui/icons-material"

export default function Devices () {
  const [modalOpen, setModalOpen] = useState<boolean | 'closing'>(false)
  return (
    <>
      <Head>
        <title>Devices</title>
      </Head>
    
      <Box className="flex items-center mb-8 gap-8">
        <Typography variant="h1">Devices</Typography>
        <Button variant="contained" endIcon={ <Add /> } onClick={ e => { setModalOpen(true) } }>Add Device</Button>
      </Box>
    
    
      { modalOpen && <DeviceForm open={ modalOpen === true } onClose={ () => setModalOpen('closing') } onExited={ () => setModalOpen(false) } /> }
      <DevicesList />
    </>
  )
}