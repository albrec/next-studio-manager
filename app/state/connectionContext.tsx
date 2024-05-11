import { Dispatch, createContext, useContext, useReducer } from 'react'
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
  const [connections, dispatch] = useReducer( connectionReducer, initialState, initializeConnections)
  
  return (
    <ConnectionsContext.Provider value={ connections }>
      <ConnectionsDispatchContext.Provider value={ dispatch }>
        {children}
      </ConnectionsDispatchContext.Provider>
    </ConnectionsContext.Provider>
  )
}

const initialState: Connection[] = []

function initializeConnections(initData = initialState) {
  const deviceData = localStorage.getItem(CONNECTION_KEY)
  return deviceData ? JSON.parse(deviceData) : initData
}



type AddConnection = { type: 'add', connection: Connection }
type DeleteConnection = { type: 'delete', id: Connection['id'] }
type ConnectionActions = AddConnection | DeleteConnection



function connectionReducer(connections: Connection[], action: ConnectionActions): Connection[] {
  switch (action.type) {
    case 'add': {
        return [...connections, action.connection]
      }
      case 'delete': {
        return connections.filter(c => c.id !== action.id)
      }
  }
}
