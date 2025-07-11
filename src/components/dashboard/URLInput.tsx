'use client';

interface URLInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function URLInput({ value, onChange, disabled }: URLInputProps) {
    return (
        <div>
            <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-900 mb-2"
            >
                Destination URL
            </label>
            <input
                type="url"
                id="url"
                name="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add link"
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={disabled}
            />
        </div>
    );
}