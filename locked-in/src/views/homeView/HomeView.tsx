import { Box, Divider, Stack, Typography } from '@mui/material'
import './HomeView.css'
import VaultList from '../../components/vaultList/VaultList';
import FilterOptions from '../../components/filterOptions/FilterOptions';
import UploadElement from '../../components/uploadElement/UploadElement';
import { useState } from 'react';
import { VaultData, VaultElementInterface } from '../../interfaces/VaultElement';

function setData() {
    
}

function HomeView() {
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [userKey, setUserKey] = useState("");
    const [data, setData] = useState<VaultElementInterface[]>(VaultData);
    
    return (
        <Stack className="HomeView" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
            <Stack className="HomeTitle" sx={{ flexDirection: 'row', marginTop: '1em', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 600, width: '100%' }}>
                    LockedIn Vault
                </Typography>
            </Stack>
            {/* <UserKeyPopup setUserKey={setUserKey}/> */}
            <Divider sx={{margin: '20px 20px 0px 20px', borderColor: 'lightgray'}}/>
            <FilterOptions onSearchChange={setSearchText} onFilterChange={setFilterType}></FilterOptions>
            <Divider sx={{margin: '20px', borderColor: 'lightgray'}}/>
            <Stack className="HomeTitle-Body" 
                sx={{
                    width: '100%',
                    height: '100%',
                    flexDirection: { xs: 'column', md: 'row' }, // Column on small screens, row on medium+
                    alignItems: { xs: 'center', md: 'flex-start' },
                    justifyContent: 'center',
                    gap: '1rem'
                }}
            >
                <Box sx={{ order: { xs: 1, md: 0 }, width: '100%', maxWidth: { xs: '100%', md: '500px' }}}>
                    <VaultList userKey={userKey} searchText={searchText} filterType={filterType} data={data}></VaultList>
                </Box>
                <Box sx={{ order: { xs: 0, md: 1 }, width: '100%', maxWidth: { xs: '100%', md: '700px' }}}>
                    {/* TODO - remove the callback here cuz we will get from backend */}
                    <UploadElement userKey={userKey} setData={setData}></UploadElement>
                </Box>
            </Stack>
        </Stack>
    )
}

export default HomeView
