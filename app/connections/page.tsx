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
        <title>Connections Page</title>
      </Head>
      <main>
        <h1 className="text-3xl">Connections page</h1>
        <ConnectionGrid />
      </main>
    </>
    );
  }