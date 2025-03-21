import { render, screen } from '@testing-library/react';
import HomeView from './HomeView';

describe('HomeView View', () => {
    test('does init', async () => {
        render(<HomeView />);

        expect(screen.getByText('LockedIn Vault')).toBeTruthy();
    });
});