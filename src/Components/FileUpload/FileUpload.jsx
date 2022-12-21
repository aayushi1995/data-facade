import React from 'react'
import './fileUpload.style.css';
import {ReactComponent as Upload} from '../../Icons/upload.svg'

const FileUpload = ({handleUpload}) => {
    return (
      <div className='fileUploadSectionContainer flexVerticallyCenterSpaceBetween'>
        <label className='fileUploadSectionContainerLeft' title="Upload your files here"> 
        <input className="fileUploadInput" for="fileupload" type="file" onChange={handleUpload} /> 
        <span>Upload Source</span>
        <span className=''><Upload/></span> 
        </label>
        <div>Inputs</div>
        <div>Results</div>
       
      </div>
    )
  }

export default FileUpload
    