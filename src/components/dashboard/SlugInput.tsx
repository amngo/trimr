'use client';

interface SlugInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function SlugInput({ value, onChange, disabled }: SlugInputProps) {
    return (
        <div>
            <label
                htmlFor="customSlug"
                className="block text-sm font-medium text-gray-900 mb-2"
            >
                Shorten Key
            </label>
            <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    trimr.in/
                </span>
                <input
                    type="text"
                    id="customSlug"
                    name="customSlug"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="(optional)"
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    disabled={disabled}
                />
            </div>
        </div>
    );
}