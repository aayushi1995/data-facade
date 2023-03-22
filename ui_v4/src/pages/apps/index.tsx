import { LandingPageHeader } from "@/components/LandingPageHeader/LandingPageHeader"
import { AppinOrg } from "../home/appinOrg/AppinOrg"
import { TutsCard } from "../home/tutsAndDocs/TutsCard"
import { AppsContainer, Container } from "./apps.style"

const Apps = () => {
    const HEADER_ENUMS = {
        title:"Your Apps",
        desc:"Manage and share all your Apps",
        btnText:"Create a New App",
        page:'apps',
        Ipplace:'Search for an App'
    }
    return (
        <Container>
        <LandingPageHeader HeaderTitle={HEADER_ENUMS.title} HeaderDesc={HEADER_ENUMS.desc} BtnText={HEADER_ENUMS.btnText} HeaderPage={HEADER_ENUMS.page} IpPlaceholder={HEADER_ENUMS.Ipplace}/>
        
        <AppsContainer >
        <AppinOrg/>
        </AppsContainer >
        <div>
        <TutsCard key={new Date().getTime()}/>
        </div>
        </Container>
    )
}

export default Apps