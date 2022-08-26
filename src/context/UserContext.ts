import React, { createContext } from 'react'

interface ContextValue {
    handleLogin: (username: string, password: string) => Promise<any>,
    handleLogout: () => Promise<void>,
    handleRefreshToken: () => Promise<boolean>,
    deleteUser(id: string): Promise<any>,
    modifyUser(data: object, id: string): Promise<any>,
    registerUser(data: object): Promise<any>,
    updatePassword(data: object): Promise<any>,
    updateUserPassword(data: any): Promise<any>,
    addGroup(data: object): Promise<any>,
    modifyGroup(data: object, id: string): Promise<any>,
    deleteGroup(id: string): Promise<any>,
    getUsers(): Promise<any>,
    getGroups(): Promise<any>,
    getPermissions(): Promise<any>,
    listIncludesPermission(app:string, model?: string, action?: string): boolean
}



export const UserContext = createContext<ContextValue>({} as ContextValue)