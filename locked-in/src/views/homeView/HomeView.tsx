import { Button, Divider, Stack, Typography } from '@mui/material'
import './HomeView.css'
import VaultList from '../../components/vaultList/VaultList';
import FilterOptions from '../../components/filterOptions/FilterOptions';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import UploadElement from '../../components/uploadElement/UploadElement';
import { useState } from 'react';

function HomeView() {
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("All");
    
    return (
        <Stack className="HomeView" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
            <Stack className="HomeTitle" sx={{ flexDirection: 'row', marginTop: '1em' }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 600, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    LockedIn Vault
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginLeft: "auto", borderRadius: "8px", textTransform: "none", padding: "8px 25px", marginRight: '1em' }}
                    endIcon={<ManageAccountsOutlinedIcon />}
                >
                    Settings
                </Button>
            </Stack>
            <Divider sx={{margin: '20px 20px 0px 20px', borderColor: 'lightgray'}}/>
            <FilterOptions onSearchChange={setSearchText} onFilterChange={setFilterType}></FilterOptions>
            <Divider sx={{margin: '20px', borderColor: 'lightgray'}}/>
            <Stack className="HomeTitle-Body" sx={{ flexDirection: 'row', width: '100vw' }}>
                <VaultList searchText={searchText} filterType={filterType}></VaultList>
                <UploadElement></UploadElement>
            </Stack>
        </Stack>
    )
}

export default HomeView
