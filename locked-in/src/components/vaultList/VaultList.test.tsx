import { render, screen } from '@testing-library/react';
import VaultList from './VaultList';
import userEvent from '@testing-library/user-event';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement';

describe('VaultList Component', () => {
    test('does init empty', async () => {
        const data: VaultElementInterface[] = [];

        render(<VaultList searchText={''} filterType={''} data={data} userKey={''} />);

        expect(screen.getByText('Vault Currently Empty')).toBeTruthy();
    });

    test('does init with element', async () => {
        const data: VaultElementInterface[] = [({id: 1, name: "key", type: ("Text" as ElementType), secret: "pubKey"} as VaultElementInterface)];

        render(<VaultList searchText={''} filterType={''} data={data} userKey={''} />);

        expect(screen.queryByText('Vault Currently Empty')).toBeNull();
    });
});