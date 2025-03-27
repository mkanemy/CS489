import { Button, Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import './UploadElement.css'
import { useRef, useState } from 'react';
import { ElementType, VaultData, VaultElementInterface } from '../../interfaces/VaultElement';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDropzone from './FileDropzone';

function UploadElement({ setData, userKey }: Readonly<{ setData: (value: VaultElementInterface[]) => void, userKey: string }>) {
    const [uploadType, setUploadType] = useState("Text");
    // const [expiryDate, setExpiryDate] = useState(dayjs().add(1, 'year'));
    const [identifierName, setIdentifierName] = useState("");
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();

            if (isSubmitting) {
                return;
            }
            setIsSubmitting(true);

            if (uploadType === ElementType.Text) {
                const value = secretRef.current ? secretRef.current.value : ""
                const encryptedValue = await encryptValue(value);
                setData([...VaultData, { id: 10, name: identifierName, type: ElementType.Text, secret: encryptedValue, fileName: "" }]);
                VaultData.push({ id: 10, name: identifierName, type: ElementType.Text, secret: encryptedValue, fileName: "" });
                if (secretRef.current) {
                    secretRef.current.value = "";
                }
            } else if (uploadType === ElementType.File) {
                if (droppedFiles.length == 0) {
                    setErrorMsg('Please Upload a File');
                    return;
                }
                const encryptedFiles = await Promise.all(
                    droppedFiles.map(async (file) => {
                        // Get buffer of file and file name
                        const fileBuffer = await file.arrayBuffer();

                        // Encrypt file content
                        const encryptedData = await encryptBuffer(fileBuffer)

                        // Encrypt file name
                        const encryptedName = await encryptValue(file.name)

                        return {
                            encryptedFileName: encryptedName,
                            encryptedData: encryptedData
                        };
                    })
                );

                encryptedFiles.forEach(({ encryptedFileName, encryptedData }) => {
                    setData([...VaultData, { id: 10, name: identifierName, type: ElementType.File, secret: encryptedData, fileName: encryptedFileName }]);
                    VaultData.push({ id: 10, name: identifierName, type: ElementType.File, secret: encryptedData, fileName: encryptedFileName });
                });

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

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                            Expiry Date
                        </Typography>
                        <DatePicker slotProps={{ textField: { variant: "filled", hiddenLabel: true, focused: true, size: "small" } }} sx={{ input: { color: 'white' } }} value={expiryDate} onChange={(x) => { setExpiryDate(x ?? dayjs().add(1, 'year')) }} />
                    </Stack>
                </LocalizationProvider> */}

                <Stack>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        Identifier Name
                    </Typography>
                    <TextField required placeholder={uploadType == "Text" ? "Example Pwd" : "example.txt"} value={identifierName} onChange={(x) => { setIdentifierName(x.target.value ?? "") }} variant="filled" hiddenLabel sx={{ input: { color: 'white' } }} color="primary" focused size="small" />
                </Stack>

                {uploadType == ElementType.Text ?
                    <Stack>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                            Secret to Store
                        </Typography>
                        <TextField required placeholder="Secret (Max. 256 Characters)" inputRef={secretRef} variant="filled" hiddenLabel sx={{ input: { color: 'white' } }} color="primary" focused size="small" inputProps={{ maxLength: 256 }}  />
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
        </form>
    )
}

export default UploadElement
