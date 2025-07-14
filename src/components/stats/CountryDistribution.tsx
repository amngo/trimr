'use client';

interface Country {
    country: string;
    clicks: number;
    percentage: string;
}

interface CountryDistributionProps {
    countries: Country[];
}

const getCountryFlag = (country: string): string => {
    const countryFlags: Record<string, string> = {
        'United States': '🇺🇸',
        Canada: '🇨🇦',
        'United Kingdom': '🇬🇧',
        Germany: '🇩🇪',
        France: '🇫🇷',
        Spain: '🇪🇸',
        Italy: '🇮🇹',
        Netherlands: '🇳🇱',
        Sweden: '🇸🇪',
        Norway: '🇳🇴',
        Denmark: '🇩🇰',
        Finland: '🇫🇮',
        Australia: '🇦🇺',
        Japan: '🇯🇵',
        'South Korea': '🇰🇷',
        China: '🇨🇳',
        India: '🇮🇳',
        Brazil: '🇧🇷',
        Mexico: '🇲🇽',
        Argentina: '🇦🇷',
        Russia: '🇷🇺',
        Poland: '🇵🇱',
        'Czech Republic': '🇨🇿',
        Austria: '🇦🇹',
        Switzerland: '🇨🇭',
        Belgium: '🇧🇪',
        Portugal: '🇵🇹',
        Greece: '🇬🇷',
        Turkey: '🇹🇷',
        Israel: '🇮🇱',
        'South Africa': '🇿🇦',
        Egypt: '🇪🇬',
        Nigeria: '🇳🇬',
        Kenya: '🇰🇪',
        Thailand: '🇹🇭',
        Vietnam: '🇻🇳',
        Singapore: '🇸🇬',
        Malaysia: '🇲🇾',
        Indonesia: '🇮🇩',
        Philippines: '🇵🇭',
        'New Zealand': '🇳🇿',
        Chile: '🇨🇱',
        Colombia: '🇨🇴',
        Peru: '🇵🇪',
        Uruguay: '🇺🇾',
        Ireland: '🇮🇪',
        Hungary: '🇭🇺',
        Romania: '🇷🇴',
        Bulgaria: '🇧🇬',
        Croatia: '🇭🇷',
        Slovenia: '🇸🇮',
        Slovakia: '🇸🇰',
        Estonia: '🇪🇪',
        Latvia: '🇱🇻',
        Lithuania: '🇱🇹',
        Ukraine: '🇺🇦',
        Belarus: '🇧🇾',
        Moldova: '🇲🇩',
    };

    return countryFlags[country] || '🌍';
};

export function CountryDistribution({ countries }: CountryDistributionProps) {
    if (countries.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                    <h2 className="card-title">Top Countries</h2>
                    <div className="text-center py-8 text-base-content/60">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>No country data available</p>
                        <p className="text-sm">
                            Geographic data will appear here once links are
                            clicked
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const maxClicks = Math.max(...countries.map((c) => c.clicks));

    return (
        <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
                <h2 className="card-title mb-4">Top Countries</h2>
                <div className="space-y-3">
                    {countries.map((country, index) => (
                        <div
                            key={country.country}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="text-lg">
                                        {getCountryFlag(country.country)}
                                    </span>
                                    <span className="font-medium truncate">
                                        {country.country}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-neutral badge-sm">
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="font-semibold">
                                        {country.clicks.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-base-content/60">
                                        {country.percentage}%
                                    </div>
                                </div>
                                <div className="w-16">
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={country.clicks}
                                        max={maxClicks}
                                    ></progress>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {countries.length === 10 && (
                    <div className="text-center mt-4 text-sm text-base-content/60">
                        Showing top 10 countries
                    </div>
                )}
            </div>
        </div>
    );
}
