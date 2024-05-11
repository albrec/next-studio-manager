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
        <title>Devices</title>
      </Head>
      <main>
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-thin">Devices</h1>
          <div className="divider divider-horizontal"></div>
          <button className="btn btn-ghost" onClick={ e => { setModalOpen(true) } }>Add Device <span className="material-symbols-outlined">Add</span></button>
        </div>
        
        
        <DeviceForm className={ classNames({ 'modal-open': modalOpen })} closeModal={ () => setModalOpen(false) } />
        <DevicesList />
      </main>
    </>
    );
  }