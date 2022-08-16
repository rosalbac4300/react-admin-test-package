import styled from 'styled-components'

interface CardProps{
  noColouredBorder : boolean
}

const Card = styled.div<CardProps>`
  margin: 0px 15px 10px 15px;
  font-size: 14px;
  border: 1px solid #eee;
  border-radius: 4px;
  word-wrap: break-word;
  background-color: #fcfcfc;
  border-top: ${(props) => (props.noColouredBorder ? '' : '3px solid #007bff')};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.13), 0 0 3px rgba(0, 0, 0, 0.2);

  .card-header {
    padding: 15px 20px;
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: solid 1px #eee;
    font-size: 16px;
    text-transform: capitalize;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: center;
  }
`

export default Card
