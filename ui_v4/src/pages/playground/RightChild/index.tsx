const RightPanel = ({visibleTab}:any) => {
    return (
        <div style={{padding:'20px'}}>
            {visibleTab === "actionrun" ? <div> Action run </div> : <div>Data Source run </div>}
        </div>
    )
}

export default RightPanel