'use client';

interface DailyActivity {
    date: string;
    clicks: number;
}

interface ActivityChartProps {
    dailyActivity: DailyActivity[];
}

export function ActivityChart({ dailyActivity }: ActivityChartProps) {
    const maxClicks = Math.max(...dailyActivity.map((d) => d.clicks), 1);
    const totalClicks = dailyActivity.reduce((sum, d) => sum + d.clicks, 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getBarHeight = (clicks: number) => {
        if (maxClicks === 0) return 0;
        return Math.max((clicks / maxClicks) * 100, clicks > 0 ? 5 : 0);
    };

    const last7Days = dailyActivity.slice(-7);
    const weeklyClicks = last7Days.reduce((sum, d) => sum + d.clicks, 0);
    const previousWeekClicks = dailyActivity
        .slice(-14, -7)
        .reduce((sum, d) => sum + d.clicks, 0);
    const weeklyChange =
        previousWeekClicks > 0
            ? (
                  ((weeklyClicks - previousWeekClicks) / previousWeekClicks) *
                  100
              ).toFixed(1)
            : weeklyClicks > 0
              ? '100'
              : '0';

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">
                        Daily Activity (Last 30 Days)
                    </h2>
                    <div className="text-right">
                        <div className="text-sm text-base-content/60">
                            This week
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">
                                {weeklyClicks.toLocaleString()}
                            </span>
                            <span
                                className={`text-xs ${Number(weeklyChange) >= 0 ? 'text-success' : 'text-error'}`}
                            >
                                {Number(weeklyChange) >= 0 ? '+' : ''}
                                {weeklyChange}%
                            </span>
                        </div>
                    </div>
                </div>

                {totalClicks === 0 ? (
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <p>No activity recorded</p>
                        <p className="text-sm">
                            Activity will appear here once your links start
                            getting clicks
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 flex flex-col h-full">
                        {/* Chart */}
                        <div className="relative grow flex items-end justify-between gap-1 bg-base-300 rounded-lg p-4">
                            {dailyActivity.map((day, index) => (
                                <div
                                    key={day.date}
                                    className="relative flex-1 flex flex-col-reverse items-center group h-full"
                                >
                                    <div
                                        className="w-full bg-primary rounded-t transition-all duration-200 hover:bg-primary-focus cursor-pointer"
                                        style={{
                                            height: `${getBarHeight(day.clicks)}%`,
                                        }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-base-content text-base-100 text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {formatDate(day.date)}: {day.clicks}{' '}
                                            {day.clicks === 1
                                                ? 'click'
                                                : 'clicks'}
                                        </div>
                                    </div>
                                    {/* Date labels for every 5th day */}
                                    {index % 5 === 0 && (
                                        <div className="text-xs text-base-content/60 mt-2 transform -rotate-45 origin-top">
                                            {formatDate(day.date)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-lg font-semibold">
                                    {totalClicks.toLocaleString()}
                                </div>
                                <div className="text-xs text-base-content/60">
                                    Total Clicks
                                </div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold">
                                    {(totalClicks / 30).toFixed(1)}
                                </div>
                                <div className="text-xs text-base-content/60">
                                    Avg Daily
                                </div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold">
                                    {maxClicks.toLocaleString()}
                                </div>
                                <div className="text-xs text-base-content/60">
                                    Peak Day
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
