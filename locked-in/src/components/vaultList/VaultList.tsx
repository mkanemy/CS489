import { Box, Stack, Typography } from '@mui/material';
import './VaultList.css'
import VaultElement from '../vaultElement/VaultElement';
import { VaultElementInterface } from '../../interfaces/VaultElement';
import { useEffect } from 'react';

function VaultList({searchText, filterType, data, userKey, setRefreshKey}: Readonly<{searchText: string, filterType: string, data: VaultElementInterface[], userKey: string, setRefreshKey: (bool: Boolean) => void}>) {

    useEffect(() => {
        console.log("HI");
    }, [data]);

    return (
        <Stack className="VaultList" sx={{ flexDirection: 'column', alignSelf: 'center', marginTop: '5%' }}>
            {data.length === 0 ?
            <Box sx={{marginTop: { md: '30%', xs: '5%'}}}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                    Vault Currently Empty
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    Use the menu on the right to add to the Vault
                </Typography>
            </Box>
            : data.map((element, index: number) => (
                (
                    (searchText === '' || element.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) && 
                    (filterType === 'All' || filterType === element.type)
                ) && (<VaultElement key={element.id || index} setRefreshKey={setRefreshKey} index={index} element={element} userKey={userKey}></VaultElement>)))}
        </Stack>
    )
}

export default VaultList
