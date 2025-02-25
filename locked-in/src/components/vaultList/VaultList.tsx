import { Stack } from '@mui/material';
import './VaultList.css'
import VaultElement from '../vaultElement/VaultElement';
import { VaultElementInterface, ElementType } from '../../interfaces/VaultElement';

function VaultList({searchText, filterType}: {searchText: string, filterType: string}) {

    let vaultList: VaultElementInterface[] = [
        {id: 1, name: "key.pub", type: ElementType.File},
        {id: 2, name: "Health Card Number", type: ElementType.String},
        {id: 3, name: "DriversLicense.png", type: ElementType.File},
        {id: 4, name: "SecretFolder.zip", type: ElementType.File},
        {id: 5, name: "Google Password", type: ElementType.String}
    ];

    return (
        <Stack className="VaultList" sx={{ flexDirection: 'column', alignSelf: 'center' }}>
            {vaultList.map((element, index: number) => (
                (
                    (searchText === '' || element.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) && 
                    (filterType === 'All' || filterType === element.type)
                ) && (<VaultElement index={index} element={element}></VaultElement>)))}
        </Stack>
    )
}

export default VaultList
