import { SearchIcon, SortAsc, SortDesc, X } from 'lucide-react';
import { useSearchStore } from '@/stores';
import type {
    SortBy,
    FilterStatus,
    FilterTimeRange,
} from '@/stores/useSearchStore';

export default function SearchAndFilters() {
    const {
        searchTerm,
        sortBy,
        sortOrder,
        filterStatus,
        filterTimeRange,
        setSearchTerm,
        setSortBy,
        toggleSortOrder,
        setFilterStatus,
        setFilterTimeRange,
        resetFilters,
    } = useSearchStore();

    const sortOptions: { value: SortBy; label: string }[] = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'clickCount', label: 'Click Count' },
        { value: 'visitorCount', label: 'Visitor Count' },
        { value: 'slug', label: 'Slug' },
        { value: 'url', label: 'URL' },
    ];

    const statusOptions: { value: FilterStatus; label: string }[] = [
        { value: 'all', label: 'All Links' },
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'disabled', label: 'Disabled' },
    ];

    const timeRangeOptions: { value: FilterTimeRange; label: string }[] = [
        { value: 'all', label: 'All Time' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
    ];

    const hasActiveFilters =
        searchTerm || filterStatus !== 'all' || filterTimeRange !== 'all';

    return (
        <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
                {/* Search Bar */}
                <label className="input input-bordered flex items-center gap-2 grow">
                    <SearchIcon size={16} />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search links by URL or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
                {/* Sort By */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort:</span>
                    <select
                        className="select select-bordered select-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={toggleSortOrder}
                        title={`Sort ${
                            sortOrder === 'asc' ? 'Ascending' : 'Descending'
                        }`}
                    >
                        {sortOrder === 'asc' ? (
                            <SortAsc size={16} />
                        ) : (
                            <SortDesc size={16} />
                        )}
                    </button>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <select
                        className="select select-bordered select-sm"
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value as FilterStatus)
                        }
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Range Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Created:</span>
                    <select
                        className="select select-bordered select-sm"
                        value={filterTimeRange}
                        onChange={(e) =>
                            setFilterTimeRange(
                                e.target.value as FilterTimeRange
                            )
                        }
                    >
                        {timeRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        className="btn btn-ghost btn-sm gap-1"
                        onClick={resetFilters}
                    >
                        <X size={14} />
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 text-sm items-center">
                    <span className="text-gray-600">Active filters:</span>
                    {searchTerm && (
                        <span className="badge badge-outline">
                            Search: &quot;{searchTerm}&quot;
                        </span>
                    )}
                    {filterStatus !== 'all' && (
                        <span className="badge badge-outline">
                            Status:{' '}
                            {
                                statusOptions.find(
                                    (opt) => opt.value === filterStatus
                                )?.label
                            }
                        </span>
                    )}
                    {filterTimeRange !== 'all' && (
                        <span className="badge badge-outline">
                            Created:{' '}
                            {
                                timeRangeOptions.find(
                                    (opt) => opt.value === filterTimeRange
                                )?.label
                            }
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
