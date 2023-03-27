import { ReactComponent as DatabaseIcon } from '@assets/icons/database.svg'
import { TableOutlined } from '@ant-design/icons'

export const IconStack = (handleClick:any) => [
    {
        id: new Date().getTime().toString(),
        value: 'connections',
        icon:<DatabaseIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'tables',
        icon:<TableOutlined />,
        onClick: handleClick,
    },
]
