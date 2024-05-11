import { useDevices, useDevicesDispatch } from "@/app/state/deviceContext"
import AddPort from "./portForm";
import { PortTypes } from "../state/descriptions";
import Device from "./device";

export default function DevicesList () {
    const devices = useDevices();

    return (
        <>
            <ul className="divide-y">
            { devices && devices.map(device => (
                <Device key={ device.id } device={ device } />
            ))}
            </ul>
        </>
    )
}