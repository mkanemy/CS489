import { Button, ButtonBase, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { VaultElementInterface } from '../../interfaces/VaultElement'
import './VaultElement.css'
import { useState } from 'react';
import { VisibilityOutlined } from '@mui/icons-material';

function VaultElement({index, element, userKey}: {index: number, element: VaultElementInterface, userKey: string}) {
    const [showSecret, setShowSecret] = useState(false);
    const [decryptedValue, setDecryptedValue] = useState("");

    const decryptValue = async (value: string) => {
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        const data = JSON.parse(atob(value));
        const iv = new Uint8Array(data.iv);

        const keyBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(userKey));

        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            new Uint8Array(data.ciphertext)
        );

        return decoder.decode(decryptedBuffer);
    };
    
    const showDecryptSecret = async () => {
        setDecryptedValue(await decryptValue(element.secret));
        setShowSecret(!showSecret);
    }
    
    return (
        <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
            <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {element.name}
                </Typography>
                <InfoOutlinedIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }}/>
            </Stack>
            <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
                    {showSecret === true ? decryptedValue : "****************"}
                </Typography>
                <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                    <ButtonBase onClick={() => {showDecryptSecret()}}>
                        {showSecret ? <VisibilityOutlined /> : <VisibilityOffOutlinedIcon />}
                        <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                            Show
                        </Typography>
                    </ButtonBase>
                </Stack>
                <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                    <ContentCopyIcon />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                        Copy
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default VaultElement
