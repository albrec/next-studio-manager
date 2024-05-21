import { Port } from "../ports/portTypes"

export interface ConnectionAddress {
  input: Port['id'],
  output: Port['id'],
}

export interface ConnectionPayload {
  input: Port,
  output: Port,
}

export interface Connection extends ConnectionAddress {
  id: string,
}