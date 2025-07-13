'use client';
import { useModalStore, useSearchStore } from '@/stores';
import { Plus, SearchIcon, Upload } from 'lucide-react';
import Button from './Button';
import AuthButton from './AuthButton';
import { ThemeToggle } from '../dashboard';

export default function Header() {
    const { openCreateLinkModal, openBulkUploadModal } = useModalStore();

    const {
        searchTerm,

        setSearchTerm,
    } = useSearchStore();

    return (
        <div className="flex items-center justify-between border-b border-base-300 pb-4 gap-4">
            <label className="input input-bordered flex items-center gap-2 grow">
                <SearchIcon size={16} />
                <input
                    type="text"
                    className="grow"
                    placeholder="Search links by URL or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </label>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={openBulkUploadModal}
                    className="gap-2"
                >
                    <Upload size={16} />
                    Bulk Upload
                </Button>
                <Button
                    variant="neutral"
                    onClick={openCreateLinkModal}
                    className="gap-2"
                >
                    <Plus size={16} />
                    Create Link
                </Button>
                <ThemeToggle />
                <AuthButton />
            </div>
        </div>
    );
}
