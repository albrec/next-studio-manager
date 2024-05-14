'use client'
import { Save, UploadFile } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useDevices } from "../state/deviceContext"

export default function SaveFile() {
    const devices = useDevices()
    
    return (
        <>
            <Button onClick={ saveFile }><Save /></Button>
            <Button onClick={ loadFile }><UploadFile /></Button>
        </>
    )
    
    async function saveFile() {
        try {
            // create a new handle
            const newHandle = await window.showSaveFilePicker()
            
            // create a FileSystemWritableFileStream to write to
            const writableStream = await newHandle.createWritable()
            
            // write our file
            await writableStream.write(JSON.stringify(devices))
            
            // close the file and write the contents to disk.
            await writableStream.close()
        } catch (err) {
            if(err instanceof Error) {
                console.error(err.name, err.message)
            }
        }
    }

    async function loadFile() {
        alert('No implemented yet.')
    }
}

