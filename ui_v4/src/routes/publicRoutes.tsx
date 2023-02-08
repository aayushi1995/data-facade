import React from "react"
import { Suspense } from "react"
import { Routes, Route } from "react-router-dom"

const Login = React.lazy(() => import("@pages/login"))
const NotFound = React.lazy(() => import("@pages/404"))

const PublicRoutes = () => {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </Suspense>
    )
}

export default PublicRoutes