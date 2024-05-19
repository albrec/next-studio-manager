import { Stack } from "@mui/material"
import { getDevices } from "@/lib/features/devices/devicesSlice"
import { useSelector } from "react-redux"
import Device from "./device"

export default function DevicesList () {
  const devices = useSelector(getDevices)

  return (
    <>
      <Stack>
        { devices && devices.sort((a,b) => a.name.localeCompare(b.name)).map(device => (
          <Device key={ device.id } device={ device } />
        ))}
      </Stack>
    </>
  )
}