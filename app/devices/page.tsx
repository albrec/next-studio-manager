"use client";

import Head from "next/head";

import DevicesList from "./devicesList";
import DeviceForm from "./deviceForm";
import { useState } from "react";
import classNames from "classnames";

export default function Devices () {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Devices Page</title>
      </Head>
      <main>
        <h1 className="text-3xl">Devices page</h1>
        <h2 className="text-xl mb-4">Devices <button className="btn" onClick={ e => { setModalOpen(true) } }>Add Device</button></h2>
        <DeviceForm className={ classNames({ 'modal-open': modalOpen })} closeModal={ () => setModalOpen(false) } />
        <DevicesList />
      </main>
    </>
    );
  }