import React from 'react'
import './buttonGroup.style.css'
import {ReactComponent as Python} from '../../Icons/python.svg'

const ButtonGroup = ({buttonArrayObject}) => (
    <div className="buttonContainer">
      <div className="buttonStyles">ADD NEW BUTTON</div>
      {buttonArrayObject.map((button) => {
          return <button className="buttonStyles" key={button.id}><Python /><span>{button.name}</span></button>
      })}
      <button className="buttonStyles" >more... </button>
    </div>
)

export default ButtonGroup
  