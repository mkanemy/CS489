import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function UserKeyPopup({setRefreshKey, setUserKey, userKey}: Readonly<{setRefreshKey: (bool: Boolean) => void, setUserKey: (input: string) => void, userKey: string}>) {
    const [open, setOpen] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [reset, setReset] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleOpenClose = () => {
        setOpen(!open);
    };

    async function hashString(input: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    useEffect(() => {
        const checkRegister = async () => {
            const res = await fetch(`${apiUrl}/user/check_registration`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok && res.status === 404) {
                setIsRegistered(false);
                return;
            }
            
            setIsRegistered(true);
        }

        if (userKey && userKey.length > 1) {
            handleOpenClose();
            return;
        }

        checkRegister();
    }, []);
    
    if (reset) {
        return (
            <Dialog
                    open={open}
                    slotProps={{
                        paper: {
                            component: 'form',
                            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
    
                                const formData = new FormData(event.currentTarget);
                                const key = formData.get("key") as string;

                                const confirmed = window.confirm("Are you sure you want to delete all data to reset your key?");
                                if (!confirmed) {
                                    return;
                                }
    
                                try {
                                    const res = await fetch(`${apiUrl}/user/register_master_key`, {
                                        method: 'POST',
                                        credentials: "include",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(await hashString(key))
                                    });
                            
                                    if (!res.ok) {
                                        const error = await res.text();
                                        setError("Invalid Key");
                                        return;
                                    }
                                    
                                    setRefreshKey(true);
                                    setUserKey(key);
                                    handleOpenClose();
                                } catch (err) {
                                    console.error(err);
                                    alert("Network error while verifying key.");
                                }
                            }
                        }
                    }}
                >
    
                <DialogTitle>Enter Key</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{fontWeight: 'bold', color: "#dc2626"}}>
                    DANGER: If you reset your key, you will lose all your previous data!
                    </DialogContentText>
                    <DialogContentText style={{fontWeight: 'bold'}}>
                        Make sure not to lose your key after resetting.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="key"
                        name="key"
                        label="Key"
                        type="key"
                        fullWidth
                        onChange={() => {setError(undefined)}}
                        variant="standard"
                        slotProps={{
                            htmlInput: {
                                inputMode: "text",
                                minLength: 16
                            }
                        }}
                    />
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: 'space-between', width: '95%', margin: '0 auto'}}>
                        <Button type="submit" style={{ color: "#dc2626" }}>Reset Key</Button>
                        <Button onClick={() => {setReset(false)}}>Back</Button>
                    </DialogActions>
                </Dialog>
        )
    }

    return (
        <Dialog
                open={open}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();

                            const formData = new FormData(event.currentTarget);
                            const key = formData.get("key") as string;

                            try {
                                if (isRegistered) {
                                    const res = await fetch(`${apiUrl}/user/check_master_key?master_key_hash=${encodeURIComponent(await hashString(key))}`, {
                                        method: 'GET',
                                        credentials: "include",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    });
                            
                                    if (!res.ok) {
                                        const error = await res.text();
                                        setError("Incorrect Key");
                                        return;
                                    }
                                } else {
                                    const res = await fetch(`${apiUrl}/user/register_master_key`, {
                                        method: 'POST',
                                        credentials: "include",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(await hashString(key))
                                    });
                            
                                    if (!res.ok) {
                                        const error = await res.text();
                                        setError("Invalid Key");
                                        return;
                                    }
                                }
                        
                                setUserKey(key);
                                handleOpenClose();
                            } catch (err) {
                                console.error(err);
                                alert("Network error while verifying key.");
                            }
                        }
                    }
                }}
            >

            <DialogTitle>Enter Key</DialogTitle>
            <DialogContent>
                <DialogContentText>
                The passphrase you enter is your key to access your vault. Keep it safe and private — do not share it and don’t forget it.
                </DialogContentText>
                <DialogContentText style={{fontWeight: 'bold'}}>
                🔐 Important: If you lose your key, you won’t be able to access your data. For security reasons, we will have to delete everything so you can start fresh with a new key.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="key"
                    name="key"
                    label="Key"
                    type="key"
                    fullWidth
                    onChange={() => {setError(undefined)}}
                    variant="standard"
                />
                </DialogContent>
                {error && 
                    <DialogContentText style={{ color: "#dc2626", textAlign: 'center'}}>
                        {error}
                    </DialogContentText>
                }
                <DialogActions style={{display: "flex", justifyContent: 'space-between', width: '95%', margin: '0 auto'}}>
                    <Button type="submit">{isRegistered ? "Enter Vault" : "Set Key"}</Button>
                    {isRegistered && <Button style={{ color: "#dc2626" }} onClick={() => {setReset(true)}}>Reset Key</Button>}
                </DialogActions>
            </Dialog>
    )
}

export default UserKeyPopup
