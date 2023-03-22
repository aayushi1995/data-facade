import { LandingPageHeader } from "@/components/LandingPageHeader/LandingPageHeader"
import { AppsContainer } from "../apps/apps.style"
import { RecenetChats } from "../chat/RecentChats/Recentchats"
import { TutsCard } from "../home/tutsAndDocs/TutsCard"

const Data = () => {
    const HEADER_ENUMS = {
        title:"Your Connections",
        desc:"Manage all your Connections.",
        btnText:"+  Add Data Source",
        page:'data',
        Ipplace:'Search Connector, data base, table...'
    }
    return (
        <>
        <LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace}/>
        
        <AppsContainer >
            <RecenetChats key={'data'}/>
        </AppsContainer >
        <div>
        <TutsCard  key={new Date().getTime()}/>
        </div>
        </>
    )
}

export default Data