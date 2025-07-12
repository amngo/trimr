import { forwardRef } from 'react';
import { cn } from '@/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'neutral' | 'success' | 'warning' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    shape?: 'default' | 'square' | 'circle';
    loading?: boolean;
    children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'neutral',
    size = 'md',
    shape = 'default',
    loading = false,
    disabled,
    children,
    ...props
}, ref) => {
    const baseClasses = 'btn';
    
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        outline: 'btn-outline',
        neutral: 'btn-neutral',
        success: 'btn-success',
        warning: 'btn-warning',
        error: 'btn-error'
    };
    
    const sizeClasses = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };
    
    const shapeClasses = {
        default: '',
        square: 'btn-square',
        circle: 'btn-circle'
    };

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                shapeClasses[shape],
                loading && 'loading',
                className
            )}
            disabled={disabled || loading}
            ref={ref}
            {...props}
        >
            {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                children
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;