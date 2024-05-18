'use client'

import { Alert, Box, Collapse } from "@mui/material"
import { useAlerts, useAlertsDispatch } from "../state/alertContext"
import type { Alert as AlertType} from "../state/descriptions"
import { useCallback, useEffect, useState } from "react"

const LINGER_TIME = 5000
const ANIMATE_TIME = 1000

export default function Alerts() {
    const alerts = useAlerts()
    
    return (
        <Box className="sticky top-0 left-0 w-full h-0 z-30 overflow-visible">
            { alerts.map(alert => (
                <AlertMsg key={ `alert_${alert.id}` }  alert={ alert } />
            ))}
        </Box>
    )
}

function AlertMsg({ alert }: { alert: AlertType }) {
    const alertsDispatch = useAlertsDispatch()
    const [isIn, setIsIn] = useState(false)

    const removeAlert = useCallback(() => {
        setIsIn(false)
        setTimeout(() => {
            alertsDispatch?.({
                type: 'delete',
                id: alert.id,
            })
            setIsIn(false)
        }, ANIMATE_TIME)
    }, [alert.id, alertsDispatch])

    useEffect(() => {
        setIsIn(true)
        if(alert.transient) {
            setTimeout(removeAlert, LINGER_TIME)
        }
    }, [alert.transient, removeAlert])

    return (
        <Collapse in={ isIn } timeout={ ANIMATE_TIME }>
            <Alert severity={ alert.severity } onClose={ !alert.transient ? removeAlert : undefined }>
                { alert.msg }
            </Alert>
        </Collapse>
    )
}