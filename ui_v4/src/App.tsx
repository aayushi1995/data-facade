import React, { ReactElement, useState } from 'react';
import { ConfigProvider, Alert } from 'antd';
import { ReactQueryDevtools } from 'react-query/devtools';
import Loader from '@components/Loader';
import AppContext from '@contexts/AppContext';
import { DataProvider } from '@contexts/DataContextProvider';
import { useAppInternal } from './hooks/useAppInternal';
import AppLayout from './layouts';
import PrivateRoutes from '@routes/privateRoutes';
import PublicRoutes from '@routes/publicRoutes'
import UploadTableContextProvider from './contexts/UploadTablePageContext';
import { HomeChatContextProvider } from './contexts/HomeChatContext';
import {Provider} from 'react-redux';
import { store } from './store/store';


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
      <PublicRoutes />
    )
  } else {
    if (!userEmail) {
      return (
        <Loader />
      )
    } else {
      return (
        <AppLayout>
          <PrivateRoutes />
        </AppLayout>

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
  const [value, setValue] = useState('');
  return (
   
      <ConfigProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        <Provider store={store}>
        <AppContext.Provider value={userSettings}>
        <HomeChatContextProvider>
          <DataProvider>
          <UploadTableContextProvider>
            <ErrorBoundary>
              {children(restProps)}
            </ErrorBoundary>
            </UploadTableContextProvider>
          </DataProvider>
          </HomeChatContextProvider>
        </AppContext.Provider>
        </Provider>
      </ConfigProvider>
    
  )
}

export default App;
