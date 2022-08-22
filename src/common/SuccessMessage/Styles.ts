import styled from 'styled-components'

const SuccessCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 16px 10px 16px;
  padding: 16px 20px;
  border: solid 1px #cbe1ba;
  color: #244d04;
  border-radius: 5px;
  width: 100%;
  font-size: 14px;
  background-color: #daeace;

  i {
    font-weight: 700;
    margin-right: 5px;
  }

  button {
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    color: #cbe1ba;
    background-color: transparent;
    border: none;
  }

  button:hover {
    color: #244d04;
  }
`

export default SuccessCard