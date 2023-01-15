import  { useContext, useEffect } from 'react';
import { Grid , Divider} from "@mui/material";
import CommonTask from "./components/CommonTask"
import Recents from "./components/Recents"
import NewItem from "./components/NewItem"
import SearchComponent from './components/SearchComponent';
import welcome from "../../images/welcomeToDF.svg"
import { SetModuleContextState } from '../../common/components/ModuleContext';
import records from "../../images/records.svg"
import library from "../../images/Library Icon.svg"
import compile from "../../images/compile.svg"
import ItemCards from './components/ItemCards';



export const HomePage = ()=>{

    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [])
    
    // Explore Quick Tutorials
    const ExploreQuickTut_Header = "EXPLORE THE QUICKSTART TUTORIAL"
    const ExploreQuickTut_subHeader = "Connect your warehouse, run actions and flows to transform your data & create interactive apps in 5 min" 
    const ExploreQuickTut_imgURL = records
    const ExploreQuickTut_ToLink = "./"

    // Create And View Apps
    const CreateAndViewApp_Header = "CREATE AND VIEW APPS"
    const CreateAndViewApp_subHeader = "Create an interactive app, share within your organization or public viewin"
    const CreateAndViewApp_imgURL = compile
    const CreateAndViewApp_ToLink = "./application"

    // Explore Our Library
    const ExploreLibrary_Header = "EXPLORE OUR LIBRARY"
    const ExploreLibrary_subHeader = "Find and use any actions, flows apps or packages from our pool of resources"
    const ExploreLibrary_imgURL = library
    const ExploreLibrary_ToLink = "./"

    return(
        <>
            <Grid container sx={{display:'flex', flexDirection:'column'}}>

                {/* Welcome and search Part of the page */}
                <Grid container xs={12} sx={{mb:2}}>
                    <Grid item xs={5}><img width="100%" src={welcome}/></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={3}>
                        <SearchComponent/>
                    </Grid>
                </Grid>
                <Divider/>
                {/* Middle part */}
                <Grid container spacing={10} sx={{mb:2,py:5}} xs={12}>
                    <Grid item xs={4}> <ItemCards header={ExploreQuickTut_Header} subHeader={ExploreQuickTut_subHeader} imgURL={ExploreQuickTut_imgURL} toLink={ExploreQuickTut_ToLink}/> </Grid>
                    <Grid item xs={4}><ItemCards header={CreateAndViewApp_Header} subHeader={CreateAndViewApp_subHeader} imgURL={CreateAndViewApp_imgURL} toLink={CreateAndViewApp_ToLink }/></Grid>
                    <Grid item xs={4}><ItemCards header={ExploreLibrary_Header} subHeader={ExploreLibrary_subHeader} imgURL={ExploreLibrary_imgURL} toLink={ExploreLibrary_ToLink }/></Grid>
                </Grid>
                {/* Lower part Common task Recent new platform things */}
                <Grid container spacing={10} xs={12}>
                    <Grid item xs={4}><CommonTask/></Grid>
                    <Grid item xs={4}><Recents/></Grid>
                    <Grid item xs={4}><NewItem/></Grid>
                </Grid>
            </Grid>
        </>
    )
}