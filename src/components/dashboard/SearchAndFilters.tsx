import { SearchIcon } from 'lucide-react';

export default function SearchAndFilters() {
    return (
        <label className="input mt-4">
            <SearchIcon size={16} />
            <input type="text" placeholder="Search for links" />
        </label>
    );
}
