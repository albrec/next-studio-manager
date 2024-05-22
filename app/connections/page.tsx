"use client"

import Head from "next/head"
import { ConnectionGrid } from "./connectionGrid"
import { Link, Typography } from "@mui/material"
import { useAppSelector } from "@/lib/hooks"
import { getDeviceCount } from "@/lib/features/devices/devicesSlice"

export default function Connections () {
  const deviceCount = useAppSelector(getDeviceCount)

  return (
    <>
      <Head>
        <title>Connections</title>
      </Head>
      
      <Typography variant="h1">Connections</Typography>
      { deviceCount ? 
        <ConnectionGrid />
        :  
        <Typography>No devices added. Please load a file or add devices from the <Link href="/devices">devices page.</Link></Typography>
      }
    </>
  )
}