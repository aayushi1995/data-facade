import { Button } from '@mui/material';
import { CodeResponse, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_REDIRECT_URL } from '../../config/config';
import { ReactQueryWrapper } from '../error-boundary/ReactQueryWrapper';
import { useGoogleClientId, useGoogleScopes } from './useGoogleHooks';



function GoogleAuth(props: { children: JSX.Element }) {
    const googleClientIdQuery = useGoogleClientId()

    return (
        <ReactQueryWrapper
            isLoading={googleClientIdQuery.isLoading}
            error={googleClientIdQuery.error}
            data={googleClientIdQuery.data}
            children={() => 
                <GoogleOAuthProvider clientId={googleClientIdQuery.data!}>
                    <LoginButton {...props}/>
                </GoogleOAuthProvider>
            }
        />
    )
}

function LoginButton(props: { children: JSX.Element }) {
    const googleScopeQuery = useGoogleScopes()
    const login = useGoogleLogin({
        onSuccess: (response: CodeResponse) => {console.log(response)},
        onError: (errorResponse) => console.log(errorResponse),
        onNonOAuthError: (nonOAuthError) => console.log(nonOAuthError),
        scope: googleScopeQuery.data?.join(" "),
        flow: 'auth-code',
        ux_mode: "redirect",
        redirect_uri: GOOGLE_REDIRECT_URL
    });

    return <ReactQueryWrapper
                isLoading={googleScopeQuery.isLoading}
                error={googleScopeQuery.error}
                data={googleScopeQuery.data}
                children={() => 
                    <Button onClick={() => login()}>
                        {props?.children}
                    </Button>
                }
            />
}

export default GoogleAuth;
