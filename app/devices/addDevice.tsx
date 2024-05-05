import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { useDevicesDispatch } from "../../state/deviceContext";
import type { Device } from "../../state/deviceContext";

export default function AddDevice () {
    const [name, setName] = useState('')
    const dispatch = useDevicesDispatch()
    return (
        <form onSubmit={ e => {
            e.preventDefault()
            e.stopPropagation()
            setName('');
            dispatch({
                type: 'add',
                id: uuidv4(),
                name,
            });
        }}>
            <fieldset>
                <legend>Add Device</legend>
                <input
                    placeholder="Device Name"
                    value={ name }
                    onChange={ e => setName(e.target.value) }
                />
                <button>Add</button>
            </fieldset>
        </form>
    )
}
