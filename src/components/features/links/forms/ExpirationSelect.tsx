'use client';
interface ExpirationSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ExpirationSelect({
    value,
    onChange,
    disabled,
}: ExpirationSelectProps) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Expiration</legend>
            <select
                id="expiration"
                name="expiration"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="select w-full"
                disabled={disabled}
            >
                <option value="never">Never</option>
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
            </select>
            <p className="label">
                Optional - Select how long the link should be valid.
            </p>
        </fieldset>
    );
}
