import { render, screen } from '@testing-library/react';
import UploadElement from './UploadElement';
import userEvent from '@testing-library/user-event';

describe('UploadElement Component', () => {
    test('does init', async () => {
        const mockSetData = jest.fn();

        render(<UploadElement userKey={''} setData={mockSetData} />);

        expect(screen.getByText('Upload')).toBeTruthy();
    });
});