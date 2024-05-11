"use client"

import Head from "next/head"

import { useState } from "react"
import { ConnectionGrid } from "./connectionGrid"

export default function Connections () {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Connections</title>
      </Head>
      <main>
        <h1>Connections</h1>
        <ConnectionGrid />
      </main>
    </>
    )
  }