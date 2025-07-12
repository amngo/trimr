interface LinksSummaryProps {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    disabled: number;
    isLoading?: boolean;
}

export default function LinksSummary({
    total,
    active,
    inactive,
    expired,
    disabled,
    isLoading = false,
}: LinksSummaryProps) {
    if (isLoading) {
        return (
            <div className="stats stats-vertical lg:stats-horizontal mt-4 bg-base-100">
                <div className="stat">
                    <div className="stat-title">Total Links</div>
                    <div className="stat-value">...</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-green-600">Active</div>
                    <div className="stat-value text-green-600">...</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-blue-600">Inactive</div>
                    <div className="stat-value text-blue-600">...</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-orange-600">Expired</div>
                    <div className="stat-value text-orange-600">...</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-red-600">Disabled</div>
                    <div className="stat-value text-red-600">...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="stats stats-vertical lg:stats-horizontal mt-4 bg-base-100 border border-base-300">
            <div className="stat">
                <div className="stat-title">Total Links</div>
                <div className="stat-value">{total}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-green-600">Active</div>
                <div className="stat-value text-green-600">{active}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-blue-600">Inactive</div>
                <div className="stat-value text-blue-600">{inactive}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-orange-600">Expired</div>
                <div className="stat-value text-orange-600">{expired}</div>
            </div>
            <div className="stat">
                <div className="stat-title text-red-600">Disabled</div>
                <div className="stat-value text-red-600">{disabled}</div>
            </div>
        </div>
    );
}
