import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
    it('should render with default props', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('btn btn-neutral');
    });

    it('should apply variant classes correctly', () => {
        render(<Button variant="primary">Primary Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });

    it('should apply size classes correctly', () => {
        render(<Button size="lg">Large Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-lg');
    });

    it('should apply shape classes correctly', () => {
        render(<Button shape="circle">Circle</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-circle');
    });

    it('should show loading state', () => {
        render(<Button loading>Loading Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button.querySelector('.loading-spinner')).toBeInTheDocument();
        expect(screen.queryByText('Loading Button')).not.toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should handle click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} disabled>
                Disabled
            </Button>,
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} loading>
                Loading
            </Button>,
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
        const ref = jest.fn();
        render(<Button ref={ref}>Ref Button</Button>);

        expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('should support all variant types', () => {
        const variants = [
            'primary',
            'secondary',
            'ghost',
            'outline',
            'neutral',
            'success',
            'warning',
            'error',
        ] as const;

        variants.forEach((variant) => {
            const { unmount } = render(
                <Button variant={variant}>{variant}</Button>,
            );
            const button = screen.getByRole('button');
            expect(button).toHaveClass(`btn-${variant}`);
            unmount();
        });
    });

    it('should support all size types', () => {
        const sizes = ['xs', 'sm', 'md', 'lg'] as const;

        sizes.forEach((size) => {
            const { unmount } = render(<Button size={size}>{size}</Button>);
            const button = screen.getByRole('button');
            if (size !== 'md') {
                expect(button).toHaveClass(`btn-${size}`);
            }
            unmount();
        });
    });
});
