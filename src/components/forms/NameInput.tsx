'use client';

interface NameInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function NameInput({
    value,
    onChange,
    disabled,
}: NameInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 28) {
            onChange(newValue);
        }
    };

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Link Name</legend>
            <input
                id="name"
                name="name"
                value={value}
                onChange={handleChange}
                placeholder="Enter a name for your link"
                className="input w-full"
                maxLength={28}
                disabled={disabled}
            />
            <p className="label">Optional - {value.length}/28 characters</p>
        </fieldset>
    );
}
