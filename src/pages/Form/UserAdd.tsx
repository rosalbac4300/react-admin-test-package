import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { ListContainer, Card, Button, ErrorMessage, TextInput, EmailInput, FormField } from '../../common'
import { UserContext } from '../../context'

interface UserAddProps {
    setLastAction(message: string): void,
    setNextAction(message: string): void,
    setActionSuccessMessage(on: boolean): void
}

const UserAdd = ({ setLastAction, setNextAction, setActionSuccessMessage }: UserAddProps) => {
  const userDataInitial = {
    username: '',
    email: ''
  }

  const navigate = useNavigate()
  const { registerUser } = useContext(UserContext)
  const [userRegisterData, setUserRegisterData] = useState(userDataInitial)
  const [passwordField1, setPasswordField1] = useState('')
  const [passwordField2, setPasswordField2] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)

  const handleSubmit = (e: any) => {
    e.prevendDefault()
  }

  const handleInputChange = useCallback((value: string, attribute: string) => {
    setUserRegisterData((userData) => {
      const data = {
        ...userData,
        [attribute]: value
      }

      return data
    })
  }, [])

  const handlePass1Change = useCallback((e: any) => {
    setPasswordField1(e.target.value)
  }, [])

  const handlePass2Change = useCallback((e: any) => {
    setPasswordField2(e.target.value)
  }, [])

  const saveUser = async () => {
    const newUser = {
      username: userRegisterData.username,
      email: userRegisterData.email,
      password: passwordField1,
      password2: passwordField2
    }

    setUserRegisterData(newUser)
    const data = await registerUser(newUser)

    if (data.status === 400) {
      setError(true)

      if (data.data.username !== undefined) {
        setUsernameError(data.data.username[0])
      } else {
        setUsernameError(null)
      }

      if (data.data.email !== undefined) {
        setEmailError(data.data.email[0])
      } else {
        setEmailError(null)
      }

      if (data.data.password !== undefined) {
        setErrorMessage(data.data.password[0])
      } else if (data.data.password2 !== undefined) {
        setErrorMessage(data.data.password2[0])
      } else {
        setErrorMessage(false)
      }

      return 'ERROR'
    } else if (data.status === 201) {
      setActionSuccessMessage(true)
      setLastAction(`The user "${userRegisterData.username}" was added successfully.`)
      return data.data.user
    }
  }

  const onSave = async () => {
    const user = await saveUser()

    if (user !== 'ERROR') {
      setNextAction('You may edit it again below.')
      navigate(`/auth/users/${user.id}/change/`)
    }
  }

  const onSaveAndAdd = async () => {
    const user = await saveUser()

    if (user !== 'ERROR') {
      setNextAction('You may add another user below.')
      navigate(`/auth/users/${user.id}/change/`)
      setUserRegisterData(userDataInitial)
      setPasswordField1('')
      setPasswordField2('')
      setError(false)
      setErrorMessage(false)
      navigate(`/auth/users/add/`)
    }
  }

  return (
    <ListContainer>
      {error && <ErrorMessage />}
      <div className="col-12 form-info">
        First, enter a username and a password. Then, you'll be able to edit more user options.
      </div>
      <form className="col-12" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-9 col-sm-12 col-md-12">
            <Card>
              <div className="card-header"> Add user </div>
              <div className="card-body">
                <TextInput
                  value={userRegisterData.username}
                  editable
                  label="Username"
                  attribute="username"
                  onChange={handleInputChange}
                  message="Required. 150 characters or fewer. Letters, digit and @/./+/-/_ only."
                />
                <FormField>
                  {usernameError && (
                    <ul className="error-message">
                      <li> {usernameError} </li>
                    </ul>
                  )}
                </FormField>
                <EmailInput
                  value={userRegisterData.email}
                  editable
                  label="Email"
                  attribute="email"
                  onChange={handleInputChange}
                />
                <FormField>
                  {emailError && (
                    <ul className="error-message">
                      <li> {emailError} </li>
                    </ul>
                  )}
                </FormField>
                <FormField>
                  <div className="col-lg-3 col-sm-2">
                    <p className="label">
                      Password <span> * </span>
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
                      Password confirmation <span> * </span>
                    </p>
                  </div>
                  <div className="col-lg-9 col-sm-10">
                    <input className="field" type="password" value={passwordField2} onChange={handlePass2Change} />
                  </div>
                  <div className="col-12">
                    <p className="input-message">Enter the same password as before, for verification.</p>
                  </div>
                  <div className="col-12">
                    {errorMessage && (
                      <ul className="error-message">
                        <li> {errorMessage} </li>
                      </ul>
                    )}
                  </div>
                </FormField>
              </div>
            </Card>
          </div>
          <div className="col-md-12 col-sm-12 col-lg-3">
            <Card>
              <div className="card-header">
                <i className="fas fa-edit"></i>
                <span>Actions</span>
              </div>
              <div className="card-body">
                <Button bgColor="#469408" onClick={onSave} type="button">
                  Save
                </Button>
                <Button bgColor="#029acf" onClick={onSaveAndAdd} type="button">
                  Save and add another
                </Button>
                <Button bgColor="#029acf" onClick={onSave} type="button">
                  Save and continue editing
                </Button>
              </div>
            </Card>
            <div className="row">
              <Button className="col-12" bgColor="silver" type="button">
                History
              </Button>
            </div>
          </div>
        </div>
      </form>
    </ListContainer>
  )
}

UserAdd.propTypes = {
  setLastAction: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired
}

export default UserAdd
