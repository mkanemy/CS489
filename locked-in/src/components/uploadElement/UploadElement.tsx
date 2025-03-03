import { Button, Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import './UploadElement.css'
import { useState } from 'react';
import { ElementType, VaultData, VaultElementInterface } from '../../interfaces/VaultElement';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function UploadElement({setData}: {setData: (value: VaultElementInterface[]) => void}) {
    const [uploadType, setUploadType] = useState("Text");
    const [expiryDate, setExpiryDate] = useState(dayjs().add(1, 'year'));
    const [identifierName, setIdentifierName] = useState("");
    // TODO - store this hashed!
    const [secret, setSecret] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploadType(event.target.value);
    };

    return (
        <Stack className="UploadElement" sx={{ flexDirection: 'column', gap: '10px' }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                Upload {uploadType}
            </Typography>
            <RadioGroup row value={uploadType} onChange={handleChange}>
                <FormControlLabel value="Text" control={<Radio sx={{color: 'white'}}/>} label="Text" />
                <FormControlLabel value="File" control={<Radio sx={{color: 'white'}}/>} label="File" />
            </RadioGroup>

            <Divider sx={{margin: '0px 0px 10px 0px', borderColor: 'lightgray'}}/>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        Expiry Date
                    </Typography>
                    <DatePicker slotProps={{ textField: { variant: "filled", hiddenLabel: true, focused: true, size: "small" } }} sx={{input: { color: 'white' } }} value={expiryDate} onChange={(x) => {setExpiryDate(x ?? dayjs().add(1, 'year'))}}/>
                </Stack>
            </LocalizationProvider>

            <Stack>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                    Identifier Name
                </Typography>
                <TextField placeholder={uploadType == "Text" ? "Example Pwd" : "example.txt"} value={identifierName} onChange={(x) => {setIdentifierName(x.target.value ?? "")}} variant="filled" hiddenLabel sx={{input: { color: 'white' } }} color="primary" focused size="small"/>
            </Stack>

            {uploadType == ElementType.String ?
                <Stack>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        Secret to Store
                    </Typography>
                    <TextField placeholder="Secret" variant="filled" value={secret} onChange={(x) => {setSecret(x.target.value ?? "")}} hiddenLabel sx={{input: { color: 'white' } }} color="primary" focused size="small"/>
                </Stack>
            :
                <div>TODO - find a file drag and drop zone</div>
            }

                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ borderRadius: "8px", textTransform: "none", padding: "8px 25px", marginTop: '20px' }}
                    onClick={(e) => {
                        // TODO - need to update backend here!!!
                        console.log(expiryDate.toString() + " " + secret + " " + identifierName);
                        console.log("UPDATING");
                        setData([...VaultData, { id: 10, name: identifierName, type: ElementType.String, secret: secret }]);
                        VaultData.push({ id: 10, name: identifierName, type: ElementType.String, secret: secret });
                    }}
                    endIcon={<FileUploadOutlinedIcon />}
                >
                    Upload
                </Button>
        </Stack>
    )
}

export default UploadElement
