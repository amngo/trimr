'use client';
import { useModalStore, useSearchStore, useSidebarStore } from '@/stores';
import {
    Plus,
    SearchIcon,
    Upload,
    PanelRightOpenIcon,
    PanelRightCloseIcon,
} from 'lucide-react';
import Button from './Button';
import { ThemeToggle } from '../dashboard';

export default function Header() {
    const { openCreateLinkModal, openBulkUploadModal } = useModalStore();
    const { searchTerm, setSearchTerm } = useSearchStore();
    const { toggleSidebar, isOpen } = useSidebarStore();

    return (
        <div className="flex items-center justify-between bg-base-300 border-b border-base-300 gap-4 sticky top-0 z-30 p-4 h-[75px]">
            <div className="flex items-center gap-4 grow">
                <Button
                    variant="ghost"
                    shape="square"
                    onClick={toggleSidebar}
                    className="flex-shrink-0"
                    title={`${isOpen ? 'Close' : 'Open'} sidebar`}
                >
                    {isOpen ? (
                        <PanelRightCloseIcon size={20} className="rotate-180" />
                    ) : (
                        <PanelRightOpenIcon size={20} className="rotate-180" />
                    )}
                </Button>
                <label className="input input-bordered flex items-center gap-2 w-full">
                    <SearchIcon size={16} />
                    <input
                        type="text"
                        placeholder="Search links by URL or name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
            </div>
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
            </div>
        </div>
    );
}
