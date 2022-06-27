import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { App } from '.'

/* const ProtectedRoute = (props: {children: JSX.Element | JSX.Element[]}) => {
    if (localStorage.getItem('access') === null) return <Navigate to={'/login'} replace />
    return props.children
} */

const Admin = (prop: {children: Array<any>}) => {
    const [adminApps, setAdminApps] = useState<Array<any>>([])

    const getApps = useCallback(() => {
        const apps = prop.children.map((element: any) => {
            
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
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<App apps={adminApps}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

Admin.propTypes = {
  children: PropTypes.node.isRequired
}

export default Admin