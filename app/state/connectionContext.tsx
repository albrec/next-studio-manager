'use client'

import { Dispatch, createContext, useContext, useEffect, useReducer, useState } from 'react'
import { type Port, type Connection, PortTypes, PortDirectionality, PortIntersection } from './descriptions'

const ConnectionsContext = createContext<Connection[] | null>(null)
const ConnectionsDispatchContext = createContext<Dispatch<ConnectionActions> | null>(null)

const CONNECTION_KEY = 'connections'

export function useConnections() {
  return useContext(ConnectionsContext)
}

export function useConnectionsDispatch() {
  return useContext(ConnectionsDispatchContext)
}


export function ConnectionsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loaded, setLoaded] = useState(false)
  const [connections, dispatch] = useReducer( connectionReducer, initialState)
  
  useEffect(() => {
    if(!loaded) {
      dispatch({ type: 'load', connections: getPersistedConnections() })
      setLoaded(true)
    }
  }, [loaded])
  
  useEffect(() => {
    if(loaded) {
      localStorage?.setItem(CONNECTION_KEY, JSON.stringify(connections))
    }
  }, [connections, loaded])
  
  return (
    <ConnectionsContext.Provider value={ connections }>
      <ConnectionsDispatchContext.Provider value={ dispatch }>
        {children}
      </ConnectionsDispatchContext.Provider>
    </ConnectionsContext.Provider>
  )
}

const initialState: Connection[] = []

function getPersistedConnections(initData = initialState) {
  let connectionData
  if (typeof localStorage === 'object') {
    const rawData = localStorage.getItem(CONNECTION_KEY)
    connectionData = rawData ? JSON.parse(rawData) : initData
  }
  return connectionData || initData
}

type ConnectionPorts = { inputPort: Port, outputPort: Port }
export type ConnectionAddress = { input: string, output: string }

type LoadConnections = { type: 'load', connections: Connection[] }
type AddConnection = { type: 'add', connection: ConnectionPorts }
type DeleteConnection = { type: 'delete', id: Connection['id'] }
export type ConnectionActions = LoadConnections | AddConnection | DeleteConnection



function connectionReducer(connections: Connection[], action: ConnectionActions): Connection[] {
  switch (action.type) {
  case 'load': {
    return action.connections
  }
  case 'add': {
    if(connections.some(c => c.inputPort.id === action.connection.inputPort.id || c.outputPort.id === action.connection.outputPort.id)) {
      return [...connections]
    } else {
      const newConnection = {
        ...action.connection,
        id: deriveConnectionId({ output: action.connection.outputPort, input: action.connection.inputPort })
      }
      connections.some(c => c.inputPort.id === action.connection.inputPort.id || c.outputPort.id === action.connection.outputPort.id)
      return [...connections, newConnection]
    }
  }
  case 'delete': {
    return connections.filter(c => c.id !== action.id)
  }
  }
}

export function deriveConnectionId({ input, output }: { input: Port | string, output: Port | string }): Connection['id'] {
  const inputId = typeof input === 'string' ? input : input.id
  const outputId = typeof output === 'string' ? output : output.id
  return outputId + inputId
}


const connectionValidators = {
  [PortTypes.AUDIO]: (input: Port, output: Port) => {
    return  input.type === PortTypes.AUDIO &&
    output.type === PortTypes.AUDIO &&
    input.io === PortDirectionality.INPUT && 
    output.io === PortDirectionality.OUTPUT
  },
  [PortTypes.MIDI]: (input: Port, output: Port) => {
    return  input.type === PortTypes.MIDI &&
    output.type === PortTypes.MIDI &&
    input.io === PortDirectionality.INPUT && 
    output.io === PortDirectionality.OUTPUT
  },
  [PortTypes.USB]: (input: Port, output: Port) => {
    return  input.type === PortTypes.USB &&
    output.type === PortTypes.USB &&
    input.host === true && 
    output.host === false
  },
}

export function isConnectionCompatible({ input, output }: PortIntersection) {
  return connectionValidators[output.type](input, output)
}