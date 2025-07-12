'use client';

import { InfoIcon } from 'lucide-react';

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
            <legend className="fieldset-legend">
                Starting Date
                <div
                    className="tooltip tooltip-right"
                    data-tip="Select the starting date for when the link will be active."
                >
                    <InfoIcon size={16} />
                </div>
            </legend>
            <input
                type="datetime-local"
                id="starting-date"
                name="starting-date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input w-full"
            />
            <p className="label">Optional</p>
        </fieldset>
    );
}
