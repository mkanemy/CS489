import { render, screen } from '@testing-library/react';
import UserKeyPopup from './UserKeyPopup';
import userEvent from '@testing-library/user-event';

describe('UserKeyPopup Component', () => {
    test('does init', async () => {
        const mockSetUserKey = jest.fn();

        render(<UserKeyPopup setUserKey={mockSetUserKey} />);

        expect(screen.getByText('Enter Key')).toBeTruthy();
    });
});