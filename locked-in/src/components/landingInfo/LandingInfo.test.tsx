import { render, screen } from '@testing-library/react';
import LandingInfo from './LandingInfo';
import userEvent from '@testing-library/user-event';

describe('LandingInfo Component', () => {
    test('does init', async () => {
        render(<LandingInfo />);

        expect(screen.getByText('LockedIn')).toBeTruthy();
    });
});