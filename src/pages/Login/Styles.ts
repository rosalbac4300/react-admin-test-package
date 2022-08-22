import styled from 'styled-components'

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  .input-container {
    box-sizing: content-box;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 12px;
    height: 33.5px;
  }

  .input-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    margin-left: -1px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0px 4px 4px 0px;
    background-color: #dddddd;
  }

  .input {
    height: 40px;
    padding: 12px 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px 0px 0px 4px;
    line-height: 1.5;
  }

  .button-container {
    width: 100%;
    padding: 12px;
  }

  .button {
    width: 100%;
    margin: 0;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .error-message {
    margin: 0px;
    width: 310px;
    text-overflow: ellipsis;
    padding: 6px 0px;
    text-align: center;
    line-height: 13px;
    font-size: 13px;
    color: crimson;
    text-align: center;
  }
`

export default LoginContainer
