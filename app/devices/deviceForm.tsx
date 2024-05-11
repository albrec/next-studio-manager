import { v4 as uuidv4 } from 'uuid'
import { FormEvent, useEffect, useRef, useState } from "react"
import { useDevicesDispatch } from "../state/deviceContext"
import { Device } from '../state/descriptions'

export default function DeviceForm ({ device, className, closeModal }: { device?: Device, className: string, closeModal(): void }) {
    const [name, setName] = useState(device?.name || '')
    const dispatch = useDevicesDispatch()
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputRef.current?.focus()
    })

    function submitForm(e: FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if(!!device) {
            dispatch?.({
                type: 'update',
                device: {
                    ...device,
                    name,
                }
            })
        } else {
            dispatch?.({
                type: 'add',
                device: {
                    id: uuidv4(),
                    name,
                    ports: []
                }
            })
        }
        closeModal()
    }

    return (
        <dialog>
            <div>
                <button onClick={ e => { e.stopPropagation; e.preventDefault; closeModal(); return false } }>✕</button>
                <form
                    onSubmit={ submitForm }
                >
                    <div className="flex flex-col gap-3">
                
                        <h3>{ !!device ? 'Update' : 'Add' } Device</h3>
                        <label className="flex items-center gap-2">
                            Name
                            <input
                                type="text"
                                placeholder="Name of device"
                                value={ name }
                                onChange={ e => setName(e.target.value) }
                                ref={ inputRef }
                                required
                            />
                        </label>
                
                        <button>{ !!device ? 'Update' : 'Add' }</button>
                    </div>
                </form>
            </div>
            <form method="dialog">
                <button onClick={ closeModal }>close</button>
            </form>
        </dialog>
    )
}
