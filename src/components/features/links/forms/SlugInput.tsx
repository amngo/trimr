'use client';

import { InfoIcon } from 'lucide-react';

interface SlugInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function SlugInput({
    value,
    onChange,
    disabled,
}: SlugInputProps) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">
                Custom Slug
                <div
                    className="tooltip tooltip-right"
                    data-tip="Type a custom slug for the link."
                >
                    <InfoIcon size={16} />
                </div>
            </legend>
            <label className="input w-full">
                <span className="label">trimr.in/</span>
                <input
                    type="text"
                    id="customSlug"
                    name="customSlug"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
                <span className="badge badge-neutral badge-xs">Optional</span>
            </label>
        </fieldset>
    );
}
