import React, { Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

const Home = React.lazy(() => import("@pages/home"))
const Data = React.lazy(() => import("@pages/data"))
const Playground = React.lazy(() => import("@pages/playground"))
const ChatComponent = React.lazy(() => import("@/pages/chat"))
const ChatInitiate = React.lazy(() => import("@/pages/chat/chatInitiate"))
const AeComponent = React.lazy(() => import("@/components/ActionExecution"))

const NotFound = React.lazy(() => import("@pages/404"))


const PrivateRoutes = () => {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/data" element={<Data />} />
                <Route path="/chats" element={<ChatComponent />} />
                <Route path="/chats/:chatId" element={<ChatInitiate />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/test" element={<AeComponent actionExecutionId="2fbc8a19-ecf7-4208-9b4e-f5d7ddd0c2c6"/>}/>
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