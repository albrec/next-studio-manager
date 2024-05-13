"use client"

import Head from "next/head"

import { useState } from "react"
import { ConnectionGrid } from "./connectionGrid"
import { Typography } from "@mui/material"

export default function Connections () {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Connections</title>
      </Head>
      <main>
        <Typography variant="h1">Connections</Typography>
        <ConnectionGrid />
      </main>
    </>
    )
  }