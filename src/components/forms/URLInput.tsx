'use client';

interface URLInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function URLInput({ value, onChange, disabled }: URLInputProps) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Destination URL</legend>
            <input
                id="url"
                name="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add link"
                className="input w-full"
                required
                disabled={disabled}
            />
            <p className="label">Required</p>
        </fieldset>
    );
}
