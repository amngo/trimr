'use client';

interface ExpirationSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ExpirationSelect({ value, onChange, disabled }: ExpirationSelectProps) {
    return (
        <div>
            <label
                htmlFor="expiration"
                className="block text-sm font-medium text-gray-900 mb-2"
            >
                Expiration
            </label>
            <div className="relative">
                <select
                    id="expiration"
                    name="expiration"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    disabled={disabled}
                >
                    <option value="never">Never</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}