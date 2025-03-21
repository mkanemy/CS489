import { render, screen } from '@testing-library/react';
import SignInCard from './SignInCard';
import userEvent from '@testing-library/user-event';

describe('SignInCard Component', () => {
    test('does init', async () => {
        render(<SignInCard />);

        expect(screen.getByText('Unlock Vault')).toBeTruthy();
    });
});