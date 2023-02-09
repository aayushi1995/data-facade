export const actionListFromBE = [
    {
        id: new Date().getTime(),
        label: 'Productivity Table',
        onClick: () => {console.log('Productivity Table')}
    },
    {
        id: new Date().getTime(),
        label: 'Monthly productivity per team',
        onClick: () => {console.log('Monthly productivity per team')}
    },
    {
        id: new Date().getTime(),
        label: 'Average time per project',
        onClick: () => {console.log('Average time per project')}
    },
    {
        id: new Date().getTime(),
        label: 'Projects that were most efficient this month',
        onClick: () => {console.log('Projects that were most efficient this monthe')}
    }
]

export const getMessageType = (message:string) => {
    // dummy Business logic
		let type:string
		if(message.includes('actions')){
			type = 'actions'
		} else if (message.includes('charts')) {
			type = 'charts'
		} else {
			type = 'text'
		}
        return type
}