'use client'

import { Dispatch, createContext, useContext, useReducer } from "react"
import { Alert, AlertBase } from "./descriptions"
import { v4 as uuidv4 } from 'uuid'

const AlertContext = createContext<Alert[]>([])
const AlertDispatchContext = createContext<Dispatch<AlertActions> | null>(null)

const initialState: Alert[] = []

export function useAlerts() {
    return useContext(AlertContext)
}

export function useAlertsDispatch() {
    return useContext(AlertDispatchContext)
}

export function AlertsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [alerts, dispatch] = useReducer(alertReducer, initialState)

    return (
        <AlertContext.Provider value={ alerts }>
            <AlertDispatchContext.Provider value={ dispatch }>
                { children }
            </AlertDispatchContext.Provider>
        </AlertContext.Provider>
    )
}

function alertReducer(alerts: Alert[], action: AlertActions): Alert[] {
    switch(action.type) {
        case 'add': {
            return [
                ...alerts,
                {
                    ...action.alert,
                    id: uuidv4(),
                }
            ]
        }
        case 'delete': {
            return alerts.filter(alert => alert.id !== action.id)
        }
    }
}

type AddAlert = { type: 'add', alert: AlertBase }
type DeleteAlert = { type: 'delete', id: string }
type AlertActions = AddAlert | DeleteAlert