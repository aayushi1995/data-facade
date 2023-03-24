import { LandingPageHeader } from "@/components/LandingPageHeader/LandingPageHeader"
import { AppsContainer } from "../apps/apps.style"
import { RecenetChats } from "../chat/RecentChats/Recentchats"
import { TutsCard } from "../home/tutsAndDocs/TutsCard"
import { ConnectionDialogContent } from "./components/ConnectionDialogContent"

const Data = () => {
    
    return (
        <>
        {/* <LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace}/> */}
        
        <div>
            {/* <RecenetChats/> */}

            <ConnectionDialogContent />
        </div>
        <div>
        <TutsCard/>
        </div>
        </>
    )
}

export default Data