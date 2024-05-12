import { useDevices, useDevicesDispatch } from "@/app/state/deviceContext"
import Device from "./device"
import { Stack } from "@mui/material"

export default function DevicesList () {
    const devices = useDevices()

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