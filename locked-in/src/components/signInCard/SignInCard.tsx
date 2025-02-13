import { Card, Divider, Stack, Typography } from '@mui/material'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import './SignInCard.css'

function SignInCard() {

    return (
        <Card variant="outlined" sx={{ maxWidth: 450, backgroundColor: 'rgb(75, 75, 75)', color: 'white', padding: '3rem 2rem 3rem 2rem', borderRadius: '1rem', boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)" }}>
            <Stack sx={{ flexDirection: "column", gap: 2 }}>
                <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                    Enter Vault
                </Typography>
                <Typography sx={{ fontWeight: 'medium', marginBottom: '5px' }}>
                    Use your google account to securely log in and enter your vault!
                </Typography>
                <Divider sx={{ backgroundColor: 'gray' }}></Divider>
                <div style={{ marginTop: '1rem'}}>
                    <GoogleOAuthProvider clientId={"TODO"}>
                    <GoogleLogin
                        onSuccess={(response) => {
                            console.log("Login Success:", response);
                        }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                    </GoogleOAuthProvider>
                </div>
            </Stack>
        </Card>
    )
}

export default SignInCard
