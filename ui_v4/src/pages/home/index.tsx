import { AppinOrg } from "./appinOrg/AppinOrg"
import { ChatHeader } from "./chatHeder/chatHeader"
import { QuickoptionCard } from "./quicOptions/QuickoptionCard"
import { TutsCard } from "./tutsAndDocs/TutsCard"

const Home = () => {
    return (
        <div>
            <ChatHeader/>
            <QuickoptionCard/>
            <AppinOrg/>
            <TutsCard key={new Date().getTime()}/>
        </div>
    )
}

export default Home