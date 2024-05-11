"use client";

import Head from "next/head";

import { useState } from "react";
import classNames from "classnames";
import { ConnectionGrid } from "./connectionGrid";

export default function Connections () {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Head>
        <title>Connections</title>
      </Head>
      <main>
        <h1 className="text-3xl font-thin">Connections</h1>
        <ConnectionGrid />
      </main>
    </>
    );
  }