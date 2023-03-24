import { ConnectionQueryContext, ConnectionStateContext } from "@/contexts/ConnectionsContext";
import { Button } from "antd";
import React from "react";

const CreateProviderOptions = () => {
    const connectionState = React.useContext(ConnectionStateContext)
    const connectionQuery = React.useContext(ConnectionQueryContext)

    const onCreate = () => {
        connectionQuery?.saveMutation?.mutate(connectionState)
    }

    return (
        <div>
            <div>
                <div>
                
                </div>
            </div>
            <div>
                {/* <div>
                    <Button disabled>Test Connection</Button>
                </div>
                <div>
                    <Button disabled>Sync</Button>
                </div> */}
                <div>
                    {connectionQuery.saveMutation?.isLoading ? (
                        <>loading...</>
                    ) : (
                        <Button  onClick={() => onCreate()}>Connect</Button>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default CreateProviderOptions;