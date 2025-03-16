import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import './UserKeyPopup.css'
import { useState } from 'react';

function UserKeyPopup({setUserKey}: Readonly<{setUserKey: (input: string) => void}>) {
    const [open, setOpen] = useState(true);

    const handleOpenClose = () => {
        setOpen(!open);
    };
    
    return (
        <Dialog
            open={open}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        setUserKey(Object.fromEntries(((new FormData(event.currentTarget)) as any).entries()).key)
                        handleOpenClose();
                    }
                }
            }}
        >

        <DialogTitle>Enter Key</DialogTitle>
        <DialogContent>
            <DialogContentText>
                The passphrase you enter is your key to enter your vault! Make sure you keep it secret, do not share it with anyone and do not forget it!
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
                variant="standard"
            />
            </DialogContent>
            <DialogActions>
                <Button type="submit">Enter Vault</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UserKeyPopup
