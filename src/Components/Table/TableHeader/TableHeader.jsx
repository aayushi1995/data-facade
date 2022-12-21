import React,{useState} from 'react'
import './tableHeader.style.css'
import {ReactComponent as ChevronRight} from '../../../Icons/chevron-right.svg'
import {ReactComponent as Visualize} from '../../../Icons/chart.svg';
import {ReactComponent as EditIcon} from '../../../Icons/edit.svg';
import {ReactComponent as Robo} from '../../../Icons/robo.svg';
import {ReactComponent as Avatar} from '../../../Icons/Avatar.svg';
import useComponentVisible from '../../../CustomHooks/useComponentVisible'

const TableHeader = ({generateChart, showChart,allowGenerateChart}) => {
    const [chartName, setChartName]= useState('Add Chart Name')
    // const [showInput, setShowInput] = useState(false)
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(false);

    const handleEditClick = () => {
        setIsComponentVisible(true)
    }

    const handleChange = (event) => {
        setChartName(event.target.value)
    }
    
    return (
        <div className='TableHeaderContainer'>
            <div className='chartNameHeaderContainer flexVerticallyCenterSpaceBetween'>
                
                <div className='chartNameLeft flexVerticallyCenterSpaceBetween'>
               
                <div className='flexVerticallyCenterSpaceBetween'>
                <div className='arrowIcon'> <ChevronRight/> </div>
                <div className='visualizeIcon'><Visualize/></div>
                    <div className='chartNameContainer' ref={ref}>
                        {!isComponentVisible 
                            ? <div className='chartNameText'>{chartName || 'Add Chart Name'}</div> 
                            : <input type="text" className='inputStyles' onChange={handleChange} value={chartName}/>}
                        
                        <div className='chartNameInfo flexVerticallyCenterSpaceBetween'>09 Paramteres . Add Source . <EditIcon style={{cursor:'pointer'}} onClick={handleEditClick}/> </div>
                    </div>
                </div>
                    
                </div>
                <div className='chartNameRight'>
                    <Robo/>
                </div>
                
            </div>
            {/*  Chart Description */}
            <div className='center' style={{padding:'30px'}}>
                <div className=''>Chart Description</div>
            </div>
           
            <div className='ChartConfigContainer flexVerticallyCenterSpaceBetween'>
                <div className='chartConfigLeft flexVerticallyCenterSpaceBetween'>
                    <Avatar />
                    <div>Chart Config</div>
                </div>
                <div className='chartNameRight'>
                    <Robo/>
                </div>
            </div>
            {/*  Data Frames */}
            <div className='dataFrameContainer flexVerticallyCenterSpaceBetween '>
                <div className='dataFrameContainerLeft flexVerticallyCenterSpaceBetween'>
                    <span className='dataFramesIcon'>06</span>
                    <span className="dateFramesText">DataFrames</span>
                </div>
                <div className='dataFrameContainerLeft'>
                   {allowGenerateChart && <button className="generateChartButton" onClick={() => generateChart(!showChart)}>{showChart ? "Show List View" : "GenerateChart"}</button> }
                </div>
            </div>
                       
        </div>

    )
}
export default TableHeader