import styled from 'styled-components'

interface ButtonProps {
  inline: boolean, 
  primary: boolean, 
  bgColor: string
}

const Button = styled.button<ButtonProps>`
  margin: ${(props) => (props.inline ? '0px 0px 0px -1px' : '10px 15px')};
  border-radius: ${(props) => (props.inline ? '0px' : '4px')};
  padding: ${(props) => (props.inline ? '4px 8px' : '8px 12px')};
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: ${(props) => (props.inline ? '14px' : '16px')};
  font-weight: 400;
  transition: 0.3s ease;
  overflow: hidden;
  background-color: ${(props) => (props.primary ? props.bgColor : '#fff')};
  border: solid 1px ${(props) => props.bgColor};
  color: ${(props) => (props.primary ? '#fff' : props.bgColor)};
  opacity: ${(props) => props.primary && 0.8};

  &:hover {
    color: #fff;
    background-color: ${(props) => props.bgColor};
    opacity: ${(props) => props.primary && 1};
  }
`

export default Button
