import { ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement'
import './VaultElement.css'
import { useState } from 'react';
import { Download, VisibilityOutlined } from '@mui/icons-material';
import { getMimeType } from '../../util/util';
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

    const showDecryptSecret = async () => {
        if (showSecret) {
            setDecryptedValue("****************");
            setShowSecret(!showSecret);
        } else {
            const val = await decryptValue(element.id);
            if (val) {
                setDecryptedValue(val.length > MAX_SECRET_LENGTH ? val.slice(0, MAX_SECRET_LENGTH) + "..." : val);
            } else {
                setDecryptedValue("error")
            }
            setShowSecret(!showSecret);
        }
    }

    const showDecryptFileName = async () => {
        if (showFileName) {
            setFileName("****************");
            setShowFileName(!showFileName);
        } else {
            setShowFileName(!showFileName);
            // setFileName(await decryptValue(element.fileName));
        }
    }

    const deleteText = async () => {
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

    const deleteFile = async () => {
        // TODO - delete file
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
        // setFileName(await decryptValue(element.fileName));
        const data = await decryptBuffer(element.secret);
        const blob = new Blob([data], { type: getMimeType(fileName) }); // Create a Blob object
        const url = URL.createObjectURL(blob); // Generate a URL for the Blob

        const a = document.createElement("a"); // Create an anchor element
        a.href = url;
        a.download = fileName; // File name
        document.body.appendChild(a);
        a.click(); // Programmatically click the anchor
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    };


    // UI for file item
    if (element.type === ElementType.File) {
        return (
            <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
                <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {element.name}
                    </Typography>
                    <ButtonBase onClick={() => { deleteFile() }}>
                        <DeleteOutlineIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
                    </ButtonBase>
                </Stack>
                <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
                        {showFileName ? fileName : "****************"}
                    </Typography>
                    <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                        <ButtonBase onClick={() => { showDecryptFileName() }}>
                            {showFileName ? <VisibilityOutlined /> : <VisibilityOffOutlinedIcon />}
                            <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                                Show
                            </Typography>
                        </ButtonBase>
                    </Stack>
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
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {element.name}
                </Typography>
                <ButtonBase onClick={() => { deleteText() }}>
                    <DeleteOutlineIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
                </ButtonBase>
            </Stack>
            <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
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
