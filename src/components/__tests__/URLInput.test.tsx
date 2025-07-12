import { render, screen, fireEvent } from '@testing-library/react';
import URLInput from '@/components/forms/URLInput';

describe('URLInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('should render with fieldset and legend', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        expect(screen.getByText('Destination URL')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display the provided value', () => {
        const testValue = 'https://example.com';
        render(<URLInput value={testValue} onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue(testValue);
    });

    it('should call onChange when input value changes', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'https://test.com' } });
        
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith('https://test.com');
    });

    it('should have correct placeholder text', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', 'Add link');
    });

    it('should be required by default', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toBeRequired();
    });

    it('should be disabled when disabled prop is true', () => {
        render(<URLInput value="" onChange={mockOnChange} disabled />);
        
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
        render(<URLInput value="" onChange={mockOnChange} disabled={false} />);
        
        const input = screen.getByRole('textbox');
        expect(input).not.toBeDisabled();
    });

    it('should have correct HTML attributes', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('id', 'url');
        expect(input).toHaveAttribute('name', 'url');
        expect(input).toHaveClass('input', 'w-full');
    });

    it('should handle multiple onChange calls', () => {
        render(<URLInput value="" onChange={mockOnChange} />);
        
        const input = screen.getByRole('textbox');
        
        fireEvent.change(input, { target: { value: 'http' } });
        fireEvent.change(input, { target: { value: 'https://' } });
        fireEvent.change(input, { target: { value: 'https://example.com' } });
        
        expect(mockOnChange).toHaveBeenCalledTimes(3);
        expect(mockOnChange).toHaveBeenNthCalledWith(1, 'http');
        expect(mockOnChange).toHaveBeenNthCalledWith(2, 'https://');
        expect(mockOnChange).toHaveBeenNthCalledWith(3, 'https://example.com');
    });
});