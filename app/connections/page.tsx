"use client"

import Head from "next/head"

import { useState } from "react"
import { ConnectionGrid } from "./connectionGrid"
import { Link, Typography } from "@mui/material"
import { useDevices } from "../state/deviceContext"

export default function Connections () {
  const [modalOpen, setModalOpen] = useState(false)
  const devices = useDevices()

  return (
    <>
      <Head>
        <title>Connections</title>
      </Head>
      <main>
        <Typography variant="h1">Connections</Typography>
        { devices?.length ? 
          <ConnectionGrid />
        :  
          <Typography>No devices added. Please load a file or add devices from the <Link href="/devices">devices page.</Link></Typography>
        }
      </main>
    </>
    )
  }