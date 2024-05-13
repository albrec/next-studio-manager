'use client'

import { Dispatch, createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { Port, Connection } from './descriptions'

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


type LoadConnections = { type: 'load', connections: Connection[] }
type AddConnection = { type: 'add', connection: Connection }
type DeleteConnection = { type: 'delete', id: Connection['id'] }
type ConnectionActions = LoadConnections | AddConnection | DeleteConnection



function connectionReducer(connections: Connection[], action: ConnectionActions): Connection[] {
  switch (action.type) {
    case 'load': {
      return action.connections
    }
    case 'add': {
        return [...connections, action.connection]
      }
      case 'delete': {
        return connections.filter(c => c.id !== action.id)
      }
  }
}
