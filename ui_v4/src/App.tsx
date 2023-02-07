import React, { ReactElement, Suspense } from 'react';
import { ConfigProvider, Typography, Alert } from 'antd';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools';
import Loader from '@components/Loader';
import AppContext from '@contexts/AppContext';
import { DataProvider } from '@contexts/DataContextProvider';
import { useAppInternal } from './hooks/useAppInternal';
const Home = React.lazy(() => import("@pages/home"))


const { ErrorBoundary } = Alert;

export const AppInternal = (props: { classes: any; userEmail: any; dummyData: any; dummyDataPending: any; activeLink: any; setActiveLink: any; isLoading: any; user: any }) => {
  const {
    userEmail,
    dummyDataPending,
    isLoading,
    user
  } = props;

  React.useEffect(() => {
    if (user && user.name)
      localStorage.setItem('user', JSON.stringify(user))
  }, [user])
  if (isLoading || dummyDataPending === 1) {
    return (
      <Loader />
    )
  } else if (user === undefined) {
    return (

      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>



    )
  } else {
    if (!userEmail) {
      return (
        <Loader />
      )
    } else {
      return (
        <Typography.Text>Login Done</Typography.Text>
      )
    }
  }
}

type ApplicationType = (props: any) => ReactElement | null;

const noop: ApplicationType = (restProps) => null;
const App = ({ children = noop }) => {
  const {
    userSettings,
    ...restProps
  } = useAppInternal();
  return <ConfigProvider>
    {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}

    <AppContext.Provider value={userSettings}>
      <DataProvider>
          <ErrorBoundary>
            {children(restProps)}
          </ErrorBoundary>
      </DataProvider>
    </AppContext.Provider>
  </ConfigProvider>
}

export default App;
