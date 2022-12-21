import React from 'react'
import ButtonGroup from '../ButtonGroup/ButtonGroup'
import './header.style.css';
import {buttonArrayObject} from '../../Utils/utils.js'

const HeaderText = () => {
    return <div className="headerContainer"><div className='headerText'>Lorem</div>
    <div className="headerContent">Calculating Recency, Frequency and Monetary Value and hence the RFM score with segments. Predicting customer by Kmeans clustering using RFM Value and creating an interactive dashboard for different customer segments using different metrics, demographics & historical customer purchase data.</div>
    <hr/>
    <ButtonGroup buttonArrayObject={buttonArrayObject}/>
    </div>
  }

  export default HeaderText