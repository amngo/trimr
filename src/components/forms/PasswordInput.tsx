import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function PasswordInput({
    value,
    onChange,
    disabled = false,
    placeholder = 'Enter password (optional)',
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} />
                Password Protection
            </legend>
            <div className="relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-12"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
                {value && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content disabled:opacity-50"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                )}
            </div>
            <p className="text-xs text-base-content/60">
                Leave empty for no password protection. Visitors will need to
                enter this password to access the link.
            </p>
        </fieldset>
    );
}
