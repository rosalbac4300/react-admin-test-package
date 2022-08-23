import React, { useState } from 'react'
import { useParams, Routes, Route } from 'react-router-dom'
import { Header, SuccessMessage, ComponentWrapper } from '../../common'
import { UserList, GroupList, UserForm, GroupForm, UserAdd, PasswordChange } from '../../pages'

const AuthManage = () => {
  const { model } = useParams()
  const [lastAction, setLastAction] = useState('nothing')
  const [nextAction, setNextAction] = useState('')
  const [actionSuccessMessage, setActionSuccessMessage] = useState(false)

  const closeSuccessMessage = () => {
    setActionSuccessMessage(false)
    setLastAction('nothing')
    setNextAction('')
  }

  return (
    <ComponentWrapper>
      <Header title={model ? model : ''} />
      {actionSuccessMessage && (
        <SuccessMessage lastAction={lastAction} nextAction={nextAction} onClick={closeSuccessMessage} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            model === 'users' ? (
              <UserList setLastAction={setLastAction} setActionSuccessMessage={setActionSuccessMessage} />
              ) : (
              model === 'groups' && (
                <GroupList setLastAction={setLastAction} setActionSuccessMessage={setActionSuccessMessage} />
              )
            )
          }
        />
        <Route
          path="/:id/change"
          element={
            model === 'users' ? (
              <UserForm
                setLastAction={setLastAction}
                setNextAction={setNextAction}
                setActionSuccessMessage={setActionSuccessMessage}
              />
            ) : (
              model === 'groups' && (
                <GroupForm
                  change
                  setLastAction={setLastAction}
                  setNextAction={setNextAction}
                  setActionSuccessMessage={setActionSuccessMessage}
                />
              )
            )
          }
        />
        <Route
          path="/:id/password"
          element={<PasswordChange setLastAction={setLastAction} setActionSuccessMessage={setActionSuccessMessage} />}
        />
        <Route
          path="/add"
          element={
            model === 'users' ? (
              <UserAdd
                setLastAction={setLastAction}
                setNextAction={setNextAction}
                setActionSuccessMessage={setActionSuccessMessage}
              />
            ) : (
              model === 'groups' && (
                <GroupForm
                  setLastAction={setLastAction}
                  setNextAction={setNextAction}
                  setActionSuccessMessage={setActionSuccessMessage}
                />
              )
            )
          }
        />
      </Routes>
    </ComponentWrapper>
  )
}

export default AuthManage
