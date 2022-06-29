import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { App } from '.'
import { DataProvider, UserProvider } from '../context'

/* const ProtectedRoute = (props: {children: JSX.Element | JSX.Element[]}) => {
    if (localStorage.getItem('access') === null) return <Navigate to={'/login'} replace />
    return props.children
} */

interface AuthType {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string | null
}

const Admin = (prop: {children: Array<any>}) => {
    const [adminApps, setAdminApps] = useState<Array<any>>([])
    const [adminAuth, setAdminAuth] = useState<AuthType | null>(null)

    const getApps = useCallback(() => {
        const filteredChildren = prop.children.filter((element: any) => element.type.name === "AdminApp")
        const auth = prop.children.filter((element: any) => element.type.name === "AdminAuth")

        if (auth.length > 1) {
            console.error("There cam only be one AdminAuth element")
        } else if (auth.length === 1){
            const admAuth = {
                refreshURL: auth[0].props.refreshURL,
                loginURL: auth[0].props.loginURL,
                userProviderURL: auth[0].props.userProviderURL,
                groupsProviderURL: auth[0].props.groupsProviderURL  
            }
            setAdminAuth(admAuth)
        }
        
        const apps = filteredChildren.map((element: any) => {
            const elemChildren = element.props.children.map((child: any) => {
                return ({
                    modelName: child.props.modelName
                })
            })

            const app = {
                appName: element.props.appName,
                children: elemChildren,
                providerUrl: element.props.dataProviderURL
            }
            
            return app
        })

        setAdminApps(apps)
    }, [prop.children])

    useEffect(() => {
        getApps()
    }, [getApps])

    return (
        <DataProvider>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/*" element={<App apps={adminApps} auth={adminAuth}/>}/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </DataProvider>
    )
}

Admin.propTypes = {
  children: PropTypes.node.isRequired
}

export default Admin