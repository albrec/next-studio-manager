import { Port } from "../ports/portTypes"

export interface ConnectionPayload {
  input: Port,
  output: Port,
}

export interface Connection extends ConnectionPayload {
  id: string,
}