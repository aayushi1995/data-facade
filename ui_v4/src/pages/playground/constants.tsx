import { ReactComponent as PlaygroundIcon } from '@assets/icons/webhook.svg'
import { ReactComponent as DatabaseIcon } from '@assets/icons/database.svg'
import { ReactComponent as PlayIcon } from '@assets/icons/play_circle.svg'

export const IconStack = (handleClick:any) => [
    {
        id: new Date().getTime().toString(),
        value: 'playground',
        icon:<PlaygroundIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'database',
        icon:<DatabaseIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'actionrun',
        icon:<PlayIcon/>,
        onClick: handleClick,
    }
]
