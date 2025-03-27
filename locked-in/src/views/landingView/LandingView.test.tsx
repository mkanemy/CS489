import { render, screen } from '@testing-library/react';
import LandingView from './LandingView';

describe('LandingView View', () => {
    test('does init', async () => {
        render(<LandingView />);

        expect(screen.queryByText('LockedIn')).toBeTruthy();
    });
});