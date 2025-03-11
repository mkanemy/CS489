import { Button, Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import './UploadElement.css'
import { useEffect, useRef, useState } from 'react';
import { ElementType, VaultData, VaultElementInterface } from '../../interfaces/VaultElement';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FileDropzone from './FileDropzone';

function UploadElement({ setData, userKey }: { setData: (value: VaultElementInterface[]) => void, userKey: string }) {
    const [uploadType, setUploadType] = useState("Text");
    const [expiryDate, setExpiryDate] = useState(dayjs().add(1, 'year'));
    const [identifierName, setIdentifierName] = useState("");
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

    const secretRef = useRef<HTMLInputElement | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        userKey;
        setUploadType(event.target.value);
    };

    const encryptValue = async (value: string) => {
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
            encoder.encode(value)
        );

        return btoa(
            JSON.stringify({
                iv: Array.from(iv),
                ciphertext: Array.from(new Uint8Array(encryptedBuffer)),
            })
        );
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (uploadType === "Text") {
                const encryptedValue = await encryptValue(secretRef.current ? secretRef.current.value : "");
                setData([...VaultData, { id: 10, name: identifierName, type: ElementType.String, secret: encryptedValue }]);
                VaultData.push({ id: 10, name: identifierName, type: ElementType.String, secret: encryptedValue });
            } else {
                // Process each file in the droppedFiles array
                const encoder = new TextEncoder();
                const keyBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(userKey));
                const key = await window.crypto.subtle.importKey(
                    "raw",
                    keyBuffer,
                    { name: "AES-GCM", length: 256 },
                    false,
                    ["encrypt"]
                );

                const encryptedFiles = await Promise.all(
                    droppedFiles.map(async (file) => {
                        const fileBuffer = await file.arrayBuffer();
                        const iv = window.crypto.getRandomValues(new Uint8Array(12));
                        const encryptedBuffer = await window.crypto.subtle.encrypt(
                            { name: "AES-GCM", iv: iv },
                            key,
                            fileBuffer
                        );

                        return {
                            fileName: file.name,
                            encryptedData: btoa(
                                JSON.stringify({
                                    iv: Array.from(iv),
                                    ciphertext: Array.from(new Uint8Array(encryptedBuffer))
                                })
                            )
                        };
                    })
                );

                encryptedFiles.forEach(({ fileName, encryptedData }) => {
                    setData([...VaultData, { id: 10, name: identifierName, type: ElementType.String, secret: encryptedData }]);
                    VaultData.push({ id: 10, name: identifierName, type: ElementType.File, secret: encryptedData });
                });

            }
        }}>
            <Stack className="UploadElement" sx={{ flexDirection: 'column', gap: '10px' }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                    Upload {uploadType}
                </Typography>
                <RadioGroup row value={uploadType} onChange={handleChange}>
                    <FormControlLabel value="Text" control={<Radio sx={{ color: 'white' }} />} label="Text" />
                    <FormControlLabel value="File" control={<Radio sx={{ color: 'white' }} />} label="File" />
                </RadioGroup>

                <Divider sx={{ margin: '0px 0px 10px 0px', borderColor: 'lightgray' }} />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                            Expiry Date
                        </Typography>
                        <DatePicker slotProps={{ textField: { variant: "filled", hiddenLabel: true, focused: true, size: "small" } }} sx={{ input: { color: 'white' } }} value={expiryDate} onChange={(x) => { setExpiryDate(x ?? dayjs().add(1, 'year')) }} />
                    </Stack>
                </LocalizationProvider>

                <Stack>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        Identifier Name
                    </Typography>
                    <TextField placeholder={uploadType == "Text" ? "Example Pwd" : "example.txt"} value={identifierName} onChange={(x) => { setIdentifierName(x.target.value ?? "") }} variant="filled" hiddenLabel sx={{ input: { color: 'white' } }} color="primary" focused size="small" />
                </Stack>

                {uploadType == ElementType.String ?
                    <Stack>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                            Secret to Store
                        </Typography>
                        <TextField placeholder="Secret" inputRef={secretRef} variant="filled" hiddenLabel sx={{ input: { color: 'white' } }} color="primary" focused size="small" />
                    </Stack>
                    :
                    // <div>TODO - find a file drag and drop zone</div>
                    <FileDropzone onFilesDrop={(files) => setDroppedFiles(files)} />
                }

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "8px", textTransform: "none", padding: "8px 25px", marginTop: '20px' }}
                    type="submit"
                    endIcon={<FileUploadOutlinedIcon />}
                >
                    Upload
                </Button>
            </Stack>
        </form>
    )
}

export default UploadElement
