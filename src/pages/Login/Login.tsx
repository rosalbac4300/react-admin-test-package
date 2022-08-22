import React, { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../../img/img'
import LoginContainer from './Styles'
import { Card, Button } from '../../common'
import { DataContext, UserContext } from '../../context'

const LogIn = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { handleLogin/* , getUsersGroupsPermissions */ } = useContext(UserContext)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!username.trim()) {
      setMessage('Username is required.')
      setLoading(false)
    } else if (!password.trim()) {
      setMessage('Password is required.')
      setLoading(false)
    } else {
      const loginResponse = await handleLogin(username, password)

      if (loginResponse.status === 200) {
        navigate('/')
        setMessage('')
        setLoading(false)
        //getUsersGroupsPermissions()
      } else if (loginResponse.status === 401) {
        setMessage(loginResponse.data.detail)
        setLoading(false)
      } else {
        setMessage('An error ocurred. Please try again')
        setLoading(false)
      }
    }
  }

  const handleUsernameChange = useCallback((event: any) => {
    setUsername(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event: any) => {
    setPassword(event.target.value)
  }, [])

  return (
    <LoginContainer>
      <div className="admin-logo">
        <img src={img.logo} alt="logo"></img>
      </div>
      <Card noColouredBorder>
        <div className="card-header">Welcome</div>
        <div className="card-body">
          <form className="wrapper">
            {message !== null && <p className="error-message"> {message} </p>}
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              ></input>
              <div className="input-icon">
                <i className="fas fa-user"></i>
              </div>
            </div>
            <div className="input-container">
              <input
                type="password"
                className="input"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              ></input>
              <div className="input-icon">
                <i className="fas fa-lock"></i>
              </div>
            </div>
            <div className="button-container">
              <Button 
                bgColor="crimson"
                primary={false}
                inline={false} 
                type="submit" 
                className="button" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                Log In
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </LoginContainer>
  )
}

export default LogIn
