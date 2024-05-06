import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { useDevicesDispatch } from "../state/deviceContext";

export default function AddDevice () {
    const [name, setName] = useState('')
    const dispatch = useDevicesDispatch()
    return (
        <form
            className="card"
            onSubmit={ e => {
                if(!dispatch) throw new TypeError('Cannot dispatch action "add" as dispatch is null')
                e.preventDefault();
                e.stopPropagation();
                setName('');
                dispatch({
                    type: 'add',
                    device: {
                        id: uuidv4(),
                        name,
                        ports: []
                    }
                });
            }}
        >
            <div className="card-body">
                <h3 className="card-title">Add Device</h3>

                <label className="input input-bordered flex items-center gap-2">
                    Name
                    <input
                        type="text"
                        placeholder="Name of device"
                        value={ name }
                        onChange={ e => setName(e.target.value) }
                    />
                </label>
                
                <button className='btn'>Add</button>
            </div>
        </form>
    )
}
