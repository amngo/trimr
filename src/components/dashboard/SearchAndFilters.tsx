import { SearchIcon } from 'lucide-react';
import { useSearchStore } from '@/stores';

export default function SearchAndFilters() {
    const { searchTerm, setSearchTerm } = useSearchStore();

    return (
        <label className="input mt-4">
            <SearchIcon size={16} />
            <input 
                type="text" 
                placeholder="Search for links" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </label>
    );
}
