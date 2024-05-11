import { v4 as uuidv4 } from 'uuid';
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDevicesDispatch } from "../state/deviceContext";
import classNames from 'classnames';
import { Device } from '../state/descriptions';

export default function DeviceForm ({ device, className, closeModal }: { device?: Device, className: string, closeModal(): void }) {
    const [name, setName] = useState(device?.name || '')
    const dispatch = useDevicesDispatch()
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputRef.current?.focus()
    })

    function submitForm(e: FormEvent) {
        e.preventDefault();
        e.stopPropagation();
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
        <dialog className={ classNames('modal', className ) }>
            <div className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={ e => { e.stopPropagation; e.preventDefault; closeModal(); return false } }>✕</button>
                <form
                    onSubmit={ submitForm }
                >
                    <div className="flex flex-col gap-3">
                
                        <h3 className="text-xl">{ !!device ? 'Update' : 'Add' } Device</h3>
                        <label className="flex items-center gap-2">
                            Name
                            <input
                                className="input input-bordered w-full max-w-xs"
                                type="text"
                                placeholder="Name of device"
                                value={ name }
                                onChange={ e => setName(e.target.value) }
                                ref={ inputRef }
                                required
                            />
                        </label>
                
                        <button className='btn'>{ !!device ? 'Update' : 'Add' }</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={ closeModal }>close</button>
            </form>
        </dialog>
    )
}
