"use client";

import Head from "next/head";
import { DevicesProvider } from "../state/deviceContext";

import DevicesList from "./devicesList";
import AddDevice from "./addDevice";

export default function Devices () {
  return (
    <DevicesProvider>
      <Head>
        <title>Devices Page</title>
      </Head>
      <main>
        <h1>Devices page</h1>
        <AddDevice />
        <DevicesList />
      </main>
    </DevicesProvider>
    );
  }