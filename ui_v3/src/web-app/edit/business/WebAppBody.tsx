import React from "react"
import { EditWebAppContext } from "../context/EditWebAppContextProvider"
import { WidthProvider, Responsive } from "react-grid-layout";
import { Box, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ComponentCard from "./ComponentCard";
import useWebAppBody from "../hooks/useWebAppBody";
import '../presentation/css/react-grid.css'
import { WebAppCanvasBox } from "../presentation/styled/WebAppCanvasBox";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const WebAppBody = () => {
    const editWebAppContext = React.useContext(EditWebAppContext)

    const { updateComponents } = useWebAppBody()
    
    return (
        <WebAppCanvasBox >
            <ResponsiveReactGridLayout
                rowHeight={1}
                useCSSTransforms={true}
                breakpoints={{ lg: 1200, md: 996, sm: 768 }}
                cols={{ lg: 14, md: 10, sm: 6 }}
                onDragStop={updateComponents}
                onResizeStop={updateComponents}
            >
                {editWebAppContext.Components.map(component => (
                    <div key={component.Id} data-grid={{...component.UILayout, i: component.Id}}>
                        <ComponentCard component={component}/>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </WebAppCanvasBox>
    )
}

export default WebAppBody