import { FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import './FilterOptions.css'

function FilterOptions({onSearchChange, onFilterChange}: {onSearchChange: (value: string) => void, onFilterChange: (value: string) => void}) {
    return (
        <Stack className="FilterOptions" sx={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Stack className="FilterOptions-Item" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    Search by Name
                </Typography>
                <TextField placeholder="key.pub" variant="filled" hiddenLabel sx={{width: '300px', input: { color: 'white' } }} color="primary" focused onChange={(e) => onSearchChange(e.target.value)} size="small"/>
            </Stack>

            <Stack className="FilterOptions-Item" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    Filter by Type
                </Typography>
                <RadioGroup row defaultValue={"All"} onChange={(e) => onFilterChange(e.target.value)}>
                    <FormControlLabel value="All" control={<Radio sx={{color: 'white'}}/>} label="All" />
                    <FormControlLabel value="Text" control={<Radio sx={{color: 'white'}}/>} label="Text" />
                    <FormControlLabel value="File" control={<Radio sx={{color: 'white'}}/>} label="File" />
                </RadioGroup>
            </Stack>
        </Stack>
    )
}

export default FilterOptions