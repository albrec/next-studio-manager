'use client'
import { Save, UploadFile } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useDevices, useDevicesDispatch } from "../state/deviceContext"
import { CSSProperties, ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, Ref, forwardRef, useRef } from "react"
import { Connection, Device } from "../state/descriptions"
import { useConnections, useConnectionsDispatch } from "../state/connectionContext"
import { useAlertsDispatch } from "../state/alertContext"

export default function FileControls() {
    const devices = useDevices()
    const deviceDispatch = useDevicesDispatch()
    const connections = useConnections()
    const connectionsDispatch = useConnectionsDispatch()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const alertsDispatch = useAlertsDispatch()
    
    return (
        <>
        <Button onClick={ saveFile }><Save /></Button>
        <Button onClick={ openFilePicker }>
            <UploadFile />
            <HiddenFileInput
                onChange={ loadFile }
                ref={ fileInputRef }
            />    
        </Button>
        </>
    )
    
    async function saveFile() {
        try {
            // create a new handle
            const newHandle = await window.showSaveFilePicker()
            
            // create a FileSystemWritableFileStream to write to
            const writableStream = await newHandle.createWritable()
            
            // write our file
            await writableStream.write(JSON.stringify({
                devices,
                connections,
            }))
            
            // close the file and write the contents to disk.
            await writableStream.close()
        } catch (err) {
            if(err instanceof Error) {
                console.error(err)
                alertsDispatch?.({
                    type: 'add',
                    alert: {
                        severity: 'error',
                        msg: `Failed to save file.`,
                    }
                })
            }
        }
    }

    function loadFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if(file) {
            const reader = new FileReader()
            reader.onload = function(e) {
                if(!!e.target && typeof e.target.result === 'string') {
                    let data: { devices: Device[], connections: Connection[] }
                    try {
                        data = JSON.parse(e.target.result)
                        deviceDispatch?.({
                            type: 'load',
                            devices: data.devices,
                        })
                        connectionsDispatch?.({
                            type: 'load',
                            connections: data.connections,
                        })
                        alertsDispatch?.({
                            type: 'add',
                            alert: {
                                severity: 'success',
                                msg: `Loaded ${data.devices.length} devices and ${data.connections.length} connections.`,
                                transient: true,
                            }
                        })
                    } catch (err) {
                        console.error(err)
                        alertsDispatch?.({
                            type: 'add',
                            alert: {
                                severity: 'error',
                                msg: `Failed to load file ${file.name}.`,
                            }
                        })
                    }
                }
            }
            reader.readAsText(file)
        }
    }
    
    async function openFilePicker() {
        fileInputRef.current?.click()
    }
}




const HiddenFileInput = forwardRef(function WrappedInput(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, ref: Ref<HTMLInputElement>) {
    const {
        onChange,
    } = props

    const styles:CSSProperties = {
        position: 'absolute',
        width: 1,
        height: 1,
        left: 0,
        bottom: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
    }

    return (
        <input 
            type="file" 
            accept="application/json"
            ref={ ref }
            onChange={ onChange }
            style={ styles }
            { ...props }
        />
    )
})


