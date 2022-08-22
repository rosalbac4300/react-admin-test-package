import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

interface MessageCardProps {
    error?: boolean
}

const MessageCard = styled.div<MessageCardProps>`
  margin: 0px 16px 10px 16px;
  padding: 16px 20px;
  width: 100%;
  font-size: 14px;
  border: 1px solid #eee;
  border-radius: 4px;
  word-wrap: break-word;
  border-left: 5px solid ${(props) => (props.error ? 'crimson' : 'green')};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.13), 0 0 3px rgba(0, 0, 0, 0.2);
`

const ErrorMessage = () => {
  return <MessageCard error> Please correct the error below.</MessageCard>
}

const SuccessCard = (props: { message: string }) => {
  return <MessageCard> {props.message} </MessageCard>
}

SuccessCard.propTypes = {
  message: PropTypes.string.isRequired
}

export { SuccessCard, ErrorMessage }
