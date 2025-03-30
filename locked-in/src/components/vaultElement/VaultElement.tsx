import { ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement'
import './VaultElement.css'
import { useState } from 'react';
import { Download, VisibilityOutlined } from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function VaultElement({ index, element, userKey, setRefreshKey}: Readonly<{ index: number, element: VaultElementInterface, userKey: string, setRefreshKey: (bool: Boolean) => void }>) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [showSecret, setShowSecret] = useState(false);
    const [decryptedValue, setDecryptedValue] = useState("");
    const [copied, setCopied] = useState(false);
    const MAX_SECRET_LENGTH = 10;

    const [showFileName, setShowFileName] = useState(false);
    const [fileName, setFileName] = useState("");

    const decryptValue = async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/vault/secret/${encodeURIComponent(id)}`, {
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Vault fetch failed:", response.status);
                return;
            }

            const data = await response.json();
            const decoder = new TextDecoder();
            return decoder.decode(await decryptBuffer(data));
        } catch (error) {
            console.error("Error fetching vault data:", error);
            return 'error';
        }
    };

    const decryptFile = async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/vault/secret/${encodeURIComponent(id)}`, {
                credentials: "include",
            });
            const blob = await response.blob();
            const encryptedFile = await blob.text(); // this gives you base64 string
    
            const decryptedArrayBuffer = await decryptFileBuffer(encryptedFile);
            return decryptedArrayBuffer;
        } catch (error) {
            console.error("Error fetching vault data:", error);
            return 'error';
        }
    };    

    const decryptBuffer = async (value:string) => {
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

        return decryptedBuffer
    }

    const decryptFileBuffer = async (value: string | ArrayBuffer) => {
        const encoder = new TextEncoder();
    
        // If it's a string, parse the base64 and JSON
        let iv, ciphertext;
        if (typeof value === 'string') {
            const jsonStr = atob(value); // decode base64
            const data = JSON.parse(jsonStr);
            iv = new Uint8Array(data.iv);
            ciphertext = new Uint8Array(data.ciphertext);
        } else {
            throw new Error("Expected a base64 string, but got binary buffer.");
        }
    
        const keyBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(userKey));
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );
    
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
    
        return decryptedBuffer;
    };
    

    const showDecryptSecret = async () => {
        if (showSecret) {
            setDecryptedValue("****************");
            setShowSecret(!showSecret);
        } else {
            const val = await decryptValue(element.id);
            if (val) {
                setDecryptedValue(val);
            } else {
                setDecryptedValue("error")
            }
            setShowSecret(!showSecret);
        }
    }

    const deleteElement = async () => {
        const confirmed = window.confirm("Are you sure you want to delete " + element.name + "?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/vault/secret/${encodeURIComponent(element.id)}`, {
                method: 'DELETE',
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Vault delete failed:", response.status);
                return;
            }

            setRefreshKey(true);
        } catch (error) {
            console.error("Error fetching vault data:", error);
            return 'error';
        }
    }

    const copyDecryptSecret = async () => {
        const val = await decryptValue(element.id);
        navigator.clipboard.writeText(val ?? 'error');
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);

    }
    const downloadFile = async () => {
        try {
            const response = await fetch(`${apiUrl}/vault/secret/${encodeURIComponent(element.id)}`, {
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });
    
            const json = await response.json();
            const encryptedFileContent = json.encrypted_file_content;
            const encryptedFileName = json.encrypted_file_name;
    
            const decryptedFileNameBuf = await decryptBuffer(encryptedFileName);
            const decryptedFileName = new TextDecoder().decode(decryptedFileNameBuf);
    
            const decryptedFileContent = await decryptFileBuffer(encryptedFileContent);
    
            const blob = new Blob([decryptedFileContent], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            a.href = url;
            a.download = decryptedFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
    
    // UI for file item
    if (element.type === ElementType.File) {
        return (
            <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
                <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {element.name}
                    </Typography>
                    
                <ButtonBase onClick={() => { deleteElement() }}>
                    <DeleteOutlineIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
                </ButtonBase>
                </Stack>
                <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
                        {showFileName ? fileName : "****************"}
                    </Typography>
                    <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                        <ButtonBase onClick={() => { downloadFile() }}>
                            <Download />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                                Download
                            </Typography>
                        </ButtonBase>
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    // UI for text item
    return (
        <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
            <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                <Typography title={element.name} sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {element.name}
                </Typography>
                <ButtonBase onClick={() => { deleteElement() }}>
                    <DeleteOutlineIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
                </ButtonBase>
            </Stack>
            <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                <Typography title={showSecret === true ? decryptedValue : "****************"} sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }} className="secret">
                    {showSecret === true ? decryptedValue : "****************"}
                </Typography>
                <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                    <ButtonBase onClick={() => { showDecryptSecret() }}>
                        {showSecret ? <VisibilityOutlined /> : <VisibilityOffOutlinedIcon />}
                        <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                            Show
                        </Typography>
                    </ButtonBase>
                </Stack>
                    <Tooltip title={copied ? "Copied!" : ""} arrow>
                        <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                            <ButtonBase onClick={() => { copyDecryptSecret() }}>
                                <ContentCopyIcon />
                                <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                                    Copy
                                </Typography>
                            </ButtonBase>
                        </Stack>
                    </Tooltip>
            </Stack>
        </Stack>
    )
}

export default VaultElement
