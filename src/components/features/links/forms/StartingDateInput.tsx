'use client';
interface StartingDateInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function StartingDateInput({
    value,
    onChange,
    disabled,
}: StartingDateInputProps) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Starting Date</legend>
            <input
                type="datetime-local"
                id="startingDate"
                name="startingDate"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input w-full"
            />
            <p className="label">
                Optional - Select the starting date for when the link will be
                accessible.
            </p>
        </fieldset>
    );
}
