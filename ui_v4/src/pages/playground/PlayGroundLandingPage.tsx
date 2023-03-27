import { LandingPageHeader } from "@/components/LandingPageHeader/LandingPageHeader"
import { AppsContainer } from "../apps/apps.style"
import { RecenetChats } from "../chat/RecentChats/Recentchats"
import { TutsCard } from "../home/tutsAndDocs/TutsCard"

const PlayGroundLand = () => {
    const HEADER_ENUMS = {
        title:"Your Playground",
        desc:"Manage all your Scratchpads and Actions.",
        btnText:"Start new Scratchpad",
        page:'playground',
        Ipplace:'Search for a Scratchpad or Action'
    }
    return (
        <>
        <LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace}/>
        
        <AppsContainer >
            
        </AppsContainer >
        <div>
        <TutsCard key={new Date().getTime()}/>
        </div>
        </>
    )
}

export default PlayGroundLand