"use client"

import Head from "next/head"

import DevicesList from "./devicesList"
import DeviceForm from "./deviceForm"
import { useState } from "react"
import classNames from "classnames"

export default function Devices () {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Devices</title>
      </Head>
      <main>
        <div className="flex items-center mb-8">
          <h1>Devices</h1>
          <button onClick={ e => { setModalOpen(true) } }>Add Device</button>
        </div>
        
        
        <DeviceForm className={ classNames({ 'modal-open': modalOpen })} closeModal={ () => setModalOpen(false) } />
        <DevicesList />
      </main>
    </>
    )
  }