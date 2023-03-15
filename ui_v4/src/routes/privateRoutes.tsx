import Apps from "@/pages/apps"
import { ChatLandingPage } from "@/pages/chat/ChatLandingPage/ChatLandingPage"
import PlayGroundLand from "@/pages/playground/PlayGroundLandingPage"
import React, { Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

const Home = React.lazy(() => import("@pages/home"))
const Data = React.lazy(() => import("@pages/data"))
const Playground = React.lazy(() => import("@pages/playground"))
const ChatInitiate = React.lazy(() => import("@/pages/chat/Chat/chatInitiate"))


const NotFound = React.lazy(() => import("@pages/404"))


const PrivateRoutes = () => {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/data" element={<Data />} />
                <Route path="/chats/:chatId" element={<ChatInitiate />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/PlayGroundLand" element={<PlayGroundLand/>}/>
                <Route path="/chatland" element={<ChatLandingPage />} />
                <Route path="/apps" element={<Apps />} />
                <Route
                    path="/tableBrowser"
                    element={<Navigate to="/" replace />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}

export default PrivateRoutes