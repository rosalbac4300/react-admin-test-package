import React, { createContext, useEffect, useState, useContext } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { UserContext } from './'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

interface DataContextProps {
  getModelData(providerURL: string, model: string): Promise<any>, 
  getModelOptions(providerURL: string, model: string): Promise<any>,
  modifyItem(providerURL: string, model: string, id: string, object: any): Promise<any>,
  deleteItem(providerURL: string, model: string, id: string): Promise<any>,
  addItem(providerURL: string, model: string, object: object): Promise<any>
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps)

interface DataProviderProps {
  children: JSX.Element | JSX.Element[]
}

const DataProvider = (props: DataProviderProps) => {
  const getModelData = async (providerURL: string, model: string) => {
    const url = `${providerURL}/${model}/`

    try {
      const data = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return data
    } catch (error: any) {
      return error.response
    }
  }

  const getModelOptions = async (providerURL: string, model: string) => {
    const url = `${providerURL}/${model}/`

    try {
      const options = await axios({
        method: 'OPTIONS',
        url: url,
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return options
    } catch (error: any) {
      return error.response
    }
  }

  const modifyItem = async (providerURL: string, model: string, id: string, object: any) => {
    const url = `${providerURL}/${model}/${id}/`

    try {
      const response = await axios.put(url, object, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      if (response.statusText !== 'OK') {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  const addItem = async (providerURL: string, model: string, object: object) => {
    const url = `${providerURL}/${model}/`

    
    try {
      const response = await axios.post(url, object, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })
      
      if (response.status !== 200 && response.status !== 201) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  const deleteItem = async (providerURL: string, model: string, id: string) => {
    const url = `${providerURL}/${model}/${id}`

    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      if (response.status !== 200 && response.status !== 204) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  return (
    <DataContext.Provider value={{ getModelData, getModelOptions, modifyItem, deleteItem, addItem }}>
      {props.children}
    </DataContext.Provider>
  )
}

export default DataProvider

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
}
