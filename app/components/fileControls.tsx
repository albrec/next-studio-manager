'use client'
import { Save, UploadFile } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useDevices, useDevicesDispatch } from "../state/deviceContext"
import { CSSProperties, ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, Ref, forwardRef, useRef } from "react"
import { Connection, Device } from "../state/descriptions"
import { useConnections, useConnectionsDispatch } from "../state/connectionContext"
import { useAlertsDispatch } from "../state/alertContext"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { getDevices } from "@/lib/features/devices/devicesSlice"
import { RootState } from "@/lib/store"
import { reHydrate } from "@/lib/middleware/localStorage"

const VERSION = 1
const FILE_TYPE_ID = 'next-studio-manager'

type NSMv1 = {
  fileType: string,
  version: number,
  modifiedAt: string,
  state: RootState,
}

type NSMcurrent = NSMv1


export default function FileControls() {
  const state = useAppSelector(state => state)
  const dispatch = useAppDispatch()
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
      await writableStream.write(serializeState(state))
            
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
          try {
            const data = deserializeState(e.target.result)
            if(data) {
              dispatch(reHydrate(data))
            } else {
              alertsDispatch?.({
                type: 'add',
                alert: {
                  severity: 'error',
                  msg: `Didn't recognize file ${file.name}.`,
                }
              })
            }
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

function serializeState(state: RootState) {
  const data: NSMcurrent = {
    fileType: FILE_TYPE_ID,
    version: VERSION,
    modifiedAt: (new Date()).toJSON(),
    state,
  }
  return JSON.stringify(data)
}

function deserializeState(raw: string) {
  let data: NSMcurrent
  try {
    data = JSON.parse(raw)
    if(data.fileType === FILE_TYPE_ID) {
      return parsers[data.version](data)
    } else {
      console.error('File format not recognized.')
    }
  } catch(e) {
    console.error('Failed to parse file: ', e)
  }
}

type Parser = (data: any) => RootState
const parsers: {[key: number]: Parser} = {
  1: (data: NSMv1) => {
    return data.state
  },
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


