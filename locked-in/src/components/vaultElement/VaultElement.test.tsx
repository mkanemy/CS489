import { render, screen } from '@testing-library/react';
import VaultElement from './VaultElement';
import userEvent from '@testing-library/user-event';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement';

describe('VaultElement Component', () => {
    test('does init', async () => {
        const element: VaultElementInterface = ({id: 1, name: "key", type: ("Text" as ElementType), secret: "pubKey"} as VaultElementInterface)

        render(<VaultElement index={1} element={element} userKey={''} />);

        expect(screen.getByText('key')).toBeTruthy();
    });
});