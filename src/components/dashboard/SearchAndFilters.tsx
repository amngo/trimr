import { FunnelIcon, SearchIcon } from 'lucide-react';

export default function SearchAndFilters() {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for links"
                            className="block w-sm pl-10 pr-3 py-2 border border-gray-300 rounded leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FunnelIcon size={16} />
                    <span>Filter</span>
                </button>
            </div>
        </div>
    );
}
