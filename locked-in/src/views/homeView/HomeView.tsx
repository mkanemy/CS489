import { Box, Divider, Stack, Typography } from '@mui/material'
import './HomeView.css'
import VaultList from '../../components/vaultList/VaultList';
import FilterOptions from '../../components/filterOptions/FilterOptions';
import UploadElement from '../../components/uploadElement/UploadElement';
import { useEffect, useState } from 'react';
import { VaultElementInterface } from '../../interfaces/VaultElement';

function HomeView() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [userKey, setUserKey] = useState("");
    const [data, setData] = useState<VaultElementInterface[]>([]);
    const [refreshKey, setRefreshKey] = useState<Boolean>(true);

    useEffect(() => {
        const fetchVaultData = async () => {
            setRefreshKey(false);
            try {
                const response = await fetch(`${apiUrl}/vault`, {
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
                setData(data as VaultElementInterface[]);
            } catch (error) {
                console.error("Error fetching vault data:", error);
            }
        };
    

        if (refreshKey) {
            fetchVaultData();
        }
    }, [refreshKey]);
    
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
                <Box sx={{ order: { xs: 1, md: 0 }, width: '100%', maxWidth: { xs: '100%', md: '60%' }}}>
                    <VaultList setRefreshKey={setRefreshKey} userKey={userKey} searchText={searchText} filterType={filterType} data={data}></VaultList>
                </Box>
                <Box sx={{ order: { xs: 0, md: 1 }, width: '100%', maxWidth: { xs: '100%', md: '40%' }}}>
                    <UploadElement userKey={userKey} setRefreshKey={setRefreshKey}></UploadElement>
                </Box>
            </Stack>
        </Stack>
    )
}

export default HomeView
