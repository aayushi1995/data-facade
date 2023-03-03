import Button from "antd/es/button"
import Space from "antd/es/space"
import { ReactComponent as UndoIcon } from '@assets/icons/undo.svg'
import { ReactComponent as AutoRenewIcon } from '@assets/icons/autorenew.svg'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { ReactComponent as MoreIcon } from '@assets/icons/more_vert.svg'


interface IButtonGroup {
    handleRun: () => void,
    handleUndo: () => void,
    handleAutoRenew: () => void,
    handleHistory: () => void,
    handleMoreOptions: () => void,
}


const ButtonGroup = ({handleRun,handleUndo,handleAutoRenew,handleHistory,handleMoreOptions}:IButtonGroup) => {
    return (
        <Space size={7} style={{marginBottom: '20px'}}>
                <Button type="primary" onClick={handleRun}>Run</Button>
                <Button  icon={<UndoIcon />} size={'middle'} onClick={handleUndo} style={{backgroundColor:'##efefef'}}/>
                {/* <Button  icon={<AutoRenewIcon />} size={'middle'} onClick={handleAutoRenew}  style={{backgroundColor:'##efefef'}}/>
                <Button type="text" icon={<HistoryIcon />} size={'middle'} onClick={handleHistory}/>
                <Button type="text" icon={<MoreIcon />} size={'middle'} onClick={handleMoreOptions}/> */}
        </Space>
    )
}
export default ButtonGroup