/* import React, { createContext } from 'react'

interface ContextValue {
    handleLogin: (username: string, password: string) => Promise<object>,
    handleLogout: () => Promise<void>,
    handleRefreshToken(): Promise<200 | 400>,
    deleteUser(id: string): Promise<string | void>,
    modifyUser(data: object, id: string): Promise<string | void>,
    registerUser(data: object): any,
    updatePassword(data: object): any,
    updateUserPassword(data: any): any,
    addGroup(data: object): any,
    modifyGroup(data: object, id: string): any,
    deleteGroup(id: string): any,
    getUsers(): any,
    getGroups(): any,
    getPermissions(): any,
    listIncludesPermission(app:string, model?: string, action?: string): boolean
}



export const UserContext = createContext<ContextValue>({} as ContextValue) */