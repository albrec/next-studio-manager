export type AlertBase = {
    severity: 'success' | 'info' | 'warning' | 'error',
    msg: string,
    transient?: boolean,
}

export type Alert = AlertBase & {
    id: string,
}
