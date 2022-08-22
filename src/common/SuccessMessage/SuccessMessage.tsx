import React from "react"
import PropTypes from 'prop-types'
import SuccessCard from "./Styles"

const SuccessMessage = (props: {
    lastAction: string | null,
    nextAction: string | null,
    onClick(): void,
  }) => {
    return (
      <SuccessCard>
        <span>
          <i className="fa-solid fa-check"></i>
          {props.lastAction} {props.nextAction}
        </span>
        <button type="button" onClick={props.onClick}>
          x
        </button>
      </SuccessCard>
    )
  }
  
  SuccessMessage.propTypes = {
    lastAction: PropTypes.string.isRequired,
    nextAction: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }
  
  export default SuccessMessage
  