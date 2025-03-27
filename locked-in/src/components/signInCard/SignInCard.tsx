import { Card, Divider, Stack, Typography } from '@mui/material';

function SignInCard() {

    const handleLoginRedirect = () => {
        window.location.href = "http://127.0.0.1:8000/login"; // Redirect to backend login
    };

    return (
        <Card variant="outlined" sx={{ maxWidth: 450, backgroundColor: '#555', color: 'white', padding: '2rem', borderRadius: '8px', boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <Stack sx={{ flexDirection: "column", gap: 2 }}>
                <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', fontWeight: 500 }}>
                    Unlock Vault
                </Typography>
                <Typography sx={{ fontWeight: 'medium', marginBottom: '5px' }}>
                    Use your Google account to securely log in and enter your vault!
                </Typography>
                <Divider sx={{ backgroundColor: 'lightgray' }}></Divider>
                <div style={{ marginTop: '1rem', width: '100%' }}>
                    <button 
                        onClick={handleLoginRedirect} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%', // Makes the button fill the container
                            backgroundColor: 'white',
                            color: '#757575',
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '500',
                            border: '1px solid #dcdcdc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <img 
                            src="https://developers.google.com/identity/images/g-logo.png" 
                            alt="Google logo" 
                            style={{ width: '20px', height: '20px', marginRight: '10px' }}
                        />
                        Sign in with Google
                    </button>
                </div>
            </Stack>
        </Card>
    );
}

export default SignInCard;
