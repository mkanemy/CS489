import { Stack } from '@mui/material';
import './VaultList.css'
import VaultElement from '../vaultElement/VaultElement';
import { VaultElementInterface } from '../../interfaces/VaultElement';

function VaultList({searchText, filterType, data, userKey}: {searchText: string, filterType: string, data: VaultElementInterface[], userKey: string}) {
    
    console.log(data);

    return (
        <Stack className="VaultList" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
            {data.map((element, index: number) => (
                (
                    (searchText === '' || element.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) && 
                    (filterType === 'All' || filterType === element.type)
                ) && (<VaultElement index={index} element={element} userKey={userKey}></VaultElement>)))}
        </Stack>
    )
}

export default VaultList
