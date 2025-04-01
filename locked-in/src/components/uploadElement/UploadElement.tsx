import { IconButton, InputAdornment, Button, Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography, Alert, Box, Snackbar } from '@mui/material'
import './UploadElement.css'
import { useRef, useState } from 'react';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDropzone from './FileDropzone';
import CasinoIcon from '@mui/icons-material/Casino';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

async function postText(name: string, secret: string, setRefreshKey: (bool: Boolean) => void) : Promise<Boolean> {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
        let res = await fetch(`${apiUrl}/vault/add/string?name=${encodeURIComponent(name)}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(secret),
        })

        if (!res.ok) {
            console.error("failed:", res.status);
            return false;
        }

        setRefreshKey(true);
        return true;
    } catch (error) {
        console.error("error:", error);
        return false;
    }
}

async function postFile(name: string, encryptedFile: string, fileName: string, setRefreshKey: (bool: Boolean) => void) : Promise<Boolean> {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Format file content for upload
    const file = new File([encryptedFile], fileName, {
        type: "application/octet-stream",
    });

    const formData = new FormData();
    formData.append("secret_file", file);
    formData.append("file_name", fileName);

    try {
        let res = await fetch(`${apiUrl}/vault/add/file?name=${encodeURIComponent(name)}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })

        if (!res.ok) {
            console.error("failed:", res.status);
            return false;
        }

        setRefreshKey(true);
        return true;
    } catch (error) {
        console.error("error:", error);
        return false;
    }
}

function UploadElement({ userKey, setRefreshKey }: Readonly<{ userKey: string, setRefreshKey: (bool: Boolean) => void }>) {
    const [uploadType, setUploadType] = useState("Text");
    // const [expiryDate, setExpiryDate] = useState(dayjs().add(1, 'year'));
    const [identifierName, setIdentifierName] = useState("");
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const secretRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploadType(event.target.value);
    };

    const encryptValue = async (value: string) => {
        const encoder = new TextEncoder();
        const valueBuffer = encoder.encode(value);

        return encryptBuffer(valueBuffer)
    };

    const encryptBuffer = async (value: BufferSource) => {
        const encoder = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const keyBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(userKey));

        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            value
        );

        return btoa(
            JSON.stringify({
                iv: Array.from(iv),
                ciphertext: Array.from(new Uint8Array(encryptedBuffer)),
            })
        );

    }

    const generateRandomPassword = (length = 32) => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);
    
        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }
    
        return password;
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();

            if (!userKey || userKey.length === 0) {
                alert("ERROR: User Key not detected");
                window.location.reload();
                return;
            }

            if (isSubmitting) {
                return;
            }
            setIsSubmitting(true);

            if (uploadType === ElementType.Text) {
                const value = secretRef.current ? secretRef.current.value : ""
                const encryptedValue = await encryptValue(value);
                if (!(await postText(identifierName, encryptedValue, setRefreshKey))) {
                    setError("Error uploading secret!");
                    setOpen(true);
                }
                if (secretRef.current) {
                    secretRef.current.value = "";
                }
            } else if (uploadType === ElementType.File) {
                if (droppedFiles.length == 0) {
                    setErrorMsg('Please Upload a File');
                    return;
                }
                const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
                await Promise.all(
                    droppedFiles.map(async (file) => {
                        if (file.size > maxFileSize) {
                            setErrorMsg('File size exceeds 5MB limit');
                            return;
                        }
                        // Get buffer of file and file name
                        const fileBuffer = await file.arrayBuffer();

                        const encryptedFile = await encryptBuffer(fileBuffer)
                        const encryptedFileName = await encryptValue(file.name)

                        if (!(await postFile(identifierName, encryptedFile, encryptedFileName, setRefreshKey))) {
                            setError("Error uploading file!");
                            setOpen(true);
                        }
                    })
                );

                setDroppedFiles([]);
            }

            setIdentifierName("");

            setTimeout(() => {
                setIsSubmitting(false);
            }, 1500);
        }}>
            <Stack className="UploadElement" sx={{ flexDirection: 'column', gap: '10px', marginTop: { xs: 0, md: '5vh' }, boxShadow: '0px 4px 20px rgba(0,0,0,0.3)' }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                    Upload {uploadType}
                </Typography>
                <RadioGroup row value={uploadType} onChange={handleChange}>
                    <FormControlLabel value="Text" control={<Radio sx={{ color: 'white' }} />} label="Text" />
                    <FormControlLabel value="File" control={<Radio sx={{ color: 'white' }} />} label="File" />
                </RadioGroup>

                <Divider sx={{ margin: '0px 0px 10px 0px', borderColor: 'lightgray' }} />


                <Stack>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        Identifier Name
                    </Typography>
                    <TextField required inputProps={{ maxLength: 128 }} placeholder={uploadType == "Text" ? "Example Pwd" : "example.txt"} value={identifierName} onChange={(x) => { setIdentifierName(x.target.value ?? "") }} variant="filled" hiddenLabel sx={{ input: { color: 'white' } }} color="primary" focused size="small" />
                </Stack>

                {uploadType == ElementType.Text ?
                    <Stack>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                            Secret to Store
                        </Typography>
                        <TextField
                            required
                            placeholder="Secret (Max. 128 Characters)"
                            inputRef={secretRef}
                            variant="filled"
                            hiddenLabel
                            sx={{ input: { color: 'white' } }}
                            color="primary"
                            focused
                            size="small"
                            inputProps={{ maxLength: 128 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => {secretRef.current ? secretRef.current.value = generateRandomPassword() : null}} edge="end" sx={{ color: 'white' }}>
                                            <CasinoIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    :
                    <FileDropzone setDroppedFiles={(files) => setDroppedFiles(files)} droppedFiles={droppedFiles} setErrorMsg={setErrorMsg} />
                }

                <Typography color='error' sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                    {errorMsg}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "8px", textTransform: "none", padding: "8px 25px" }}
                    type="submit"
                    endIcon={<FileUploadOutlinedIcon />}
                >
                    Upload
                </Button>
            </Stack>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                <Alert
                    severity="error"
                    sx={{
                    mt: 2,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: '#ffb4b4',
                    border: '1px solid #ff4d4d',
                    fontWeight: 500,
                    }}
                    iconMapping={{
                    error: <ErrorOutlineIcon fontSize="small" sx={{ color: '#ff4d4d' }} />
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </form>
    )
}

export default UploadElement
