import React, { useState, useCallback, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, ListContainer, Card, FormField, Button, ErrorMessage, SuccessCard } from '../../common'
import { UserContext } from '../../context'

interface PasswordChangeProps {
  currentUser?: boolean, 
  setLastAction(text: string): void,
  setActionSuccessMessage(on: boolean): void
}

const PasswordChange = ({ currentUser = false, setLastAction, setActionSuccessMessage }: PasswordChangeProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUsers, updatePassword, updateUserPassword } = useContext(UserContext)
  const [user, setUser] = useState<any>(null)
  const [oldPassword, setOldPassword] = useState('')
  const [passwordField1, setPasswordField1] = useState('')
  const [passwordField2, setPasswordField2] = useState('')
  const [newPasswordMessage, setNewPasswordMessage] = useState('')
  const [oldPasswordMessage, setOldPasswordMessage] = useState('')
  const [changeSuccess, setChangeSuccess] = useState(false)
  const [error, setError] = useState(false)

  const getUser = async () => {
    if (currentUser) {
      const currUs = localStorage.getItem('user')
      const us = JSON.parse(currUs ? currUs : '')
      setUser(us)
    } else {
      const users = await getUsers()

      users.find((item: any) => {
        if (id !== undefined && item.pk === parseInt(id)) {
          setUser(item)
        }
      })
    }
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()
    var data

    if(user !== null){
      if (currentUser) {
        data = {
          password: passwordField1,
          password2: passwordField2,
          old_password: oldPassword,
          id: user.id
        }
      } else {
        data = {
          password: passwordField1,
          password2: passwordField2,
          id: id
        }
      }
  
      var response
  
      if (currentUser) {
        response = await updatePassword(data)
      } else {
        response = await updateUserPassword(data)
      }

      console.log(response)

      if (response.data.old_password) {
        setOldPasswordMessage(response.data.old_password[0])
        setError(true)
      } else {
        setOldPasswordMessage('')
      }
  
      if (response.data.password) {
        setNewPasswordMessage(response.data.password[0])
        setError(true)
      } else {
        setNewPasswordMessage('')
      }
  
      if (response.status === 200) {
        setError(false)
  
        if (currentUser) {
          setChangeSuccess(true)
          setNewPasswordMessage('')
          setOldPassword('')
        } else {
          setActionSuccessMessage(true)
          setLastAction('Password changed successfully.')
          navigate(`/auth/user/${id}/change`)
        }
      }
    }
  }

  const handleOldPassChange = useCallback((e: any) => {
    setOldPassword(e.target.value)
  }, [])

  const handlePass1Change = useCallback((e: any) => {
    setPasswordField1(e.target.value)
  }, [])

  const handlePass2Change = useCallback((e: any) => {
    setPasswordField2(e.target.value)
  }, [])

  useEffect(() => {
    getUser()
  }, [id, currentUser])

  if (!changeSuccess) {
    return (
      user && (
        <ListContainer>
          {currentUser && <Header title="Change Password" />}
          {error && <ErrorMessage />}
          <Card className="col-12">
            <div className="card-header">
              {currentUser ? (
                <p>
                  Please enter your old password, for security's sake, and then enter your new password twice so we can
                  verify you typed it in correctly.
                </p>
              ) : (
                <p>
                  Enter a new password for the user <strong>{user.display_name}</strong>.
                </p>
              )}
            </div>
            <div className="card-body">
              <form>
                {currentUser && (
                  <FormField>
                    <div className="col-lg-3 col-sm-2">
                      <p className="label">
                        Old password <span> * </span>
                      </p>
                    </div>
                    <div className="col-lg-9 col-sm-10">
                      <input className="field" type="password" value={oldPassword} onChange={handleOldPassChange} />
                    </div>
                    <div className="col-12">
                      {oldPasswordMessage !== '' && (
                        <ul className="error-message">
                          <li> {oldPasswordMessage} </li>
                        </ul>
                      )}
                    </div>
                  </FormField>
                )}
                <FormField>
                  <div className="col-lg-3 col-sm-2">
                    <p className="label">
                      New password <span> * </span>
                    </p>
                  </div>
                  <div className="col-lg-9 col-sm-10">
                    <input className="field" type="password" value={passwordField1} onChange={handlePass1Change} />
                  </div>
                  <div className="col-12">
                    <ul className="input-message">
                      <li>
                        <p className="input-message">
                          Your password can't be too similar to your other personal information.
                        </p>
                      </li>
                      <li>
                        <p className="input-message">Your password must contain at least 8 characters.</p>
                      </li>
                      <li>
                        <p className="input-message">Your password can't be a commonly used password.</p>
                      </li>
                      <li>
                        <p className="input-message">Your password can't be enterely numeric.</p>
                      </li>
                    </ul>
                  </div>
                </FormField>
                <FormField>
                  <div className="col-lg-3 col-sm-2">
                    <p className="label">
                      New password confirmation <span> * </span>
                    </p>
                  </div>
                  <div className="col-lg-9 col-sm-10">
                    <input className="field" type="password" value={passwordField2} onChange={handlePass2Change} />
                  </div>
                  <div className="col-12">
                    <p className="input-message">Enter the same password as before, for verification.</p>
                  </div>
                  <div className="col-12">
                    {newPasswordMessage !== '' && (
                      <ul className="error-message">
                        <li> {newPasswordMessage} </li>
                      </ul>
                    )}
                  </div>
                </FormField>
                <div className="row">
                  <Button bgColor="crimson" onClick={handleFormSubmit} type="button">
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </ListContainer>
      )
    )
  } else {
    return (
      <ListContainer>
        <Header title="Password Change Successful" />
        <SuccessCard message="Your password was changed." />
      </ListContainer>
    )
  }
}

PasswordChange.propTypes = {
  currentUser: PropTypes.bool,
  setLastAction: PropTypes.func,
  setActionSuccessMessage: PropTypes.func
}

export default PasswordChange
