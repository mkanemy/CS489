import { render, screen } from '@testing-library/react';
import FilterOptions from './FilterOptions';
import userEvent from '@testing-library/user-event';

describe('FilterOptions Component', () => {
    test('does init', async () => {
        const mockSearchChange = jest.fn();
        const mockFilterChange = jest.fn();

        render(<FilterOptions onSearchChange={mockSearchChange} onFilterChange={mockFilterChange} />);

        expect(screen.getByText('Search by Name')).toBeTruthy();
    });

    test('does call search change', async () => {
        const mockSearchChange = jest.fn();
        const mockFilterChange = jest.fn();

        render(<FilterOptions onSearchChange={mockSearchChange} onFilterChange={mockFilterChange} />);

        const input = screen.getByPlaceholderText('key.pub');

        await userEvent.type(input, 'my-key');

        expect(mockSearchChange).toHaveBeenCalled();
        expect(mockSearchChange).toHaveBeenLastCalledWith('my-key');
    });
});
