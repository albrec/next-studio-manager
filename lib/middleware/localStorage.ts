import { GetState, ListenerMiddleware, createAction, createReducer } from "@reduxjs/toolkit"
import { AppStore, RootState } from "../store"

const FORMAT_VERSION = 1

//MIDDLEWARE
export const localStorageMiddleware: ListenerMiddleware = ({ getState }) => {
  return next => action => {
    const result = next(action)
    if(typeof localStorage === 'object') {
      const data = {
        state: getState(),
        modifiedAt: (new Date()).toJSON(),
        version: FORMAT_VERSION,
      }
      localStorage.setItem('applicationState', JSON.stringify(data))
    }
    return result
  }
}

export const reHydrateData = () => {
  if(typeof localStorage !== 'object') return
  const rawData = localStorage?.getItem('applicationState')
  if (typeof rawData === 'string') {
    try {
      const data = JSON.parse(rawData)
      if(data.version === FORMAT_VERSION) {
        return data.state // re-hydrate the store
      } else {
        console.warn(`Format of stored data does not match current version. Current version: ${FORMAT_VERSION} | Data version: ${data.version}`)
      }
    } catch(e) {
      console.error('Could not load data from localStorage', e)
    }
  }
}


// Reducer
export const reHydrate = createAction<RootState>('reHydrate')