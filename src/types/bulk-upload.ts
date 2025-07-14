export interface CSVLinkData {
    url: string;
    name?: string;
    startDate?: string;
    expiration?: string;
    password?: string;
}

export interface BulkUploadResult {
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    errors?: BulkUploadError[];
    links?: Array<{
        url: string;
        slug: string;
        success: boolean;
        error?: string;
    }>;
}

export interface BulkUploadError {
    row: number;
    url: string;
    error: string;
}

export interface BulkUploadProgress {
    total: number;
    processed: number;
    successful: number;
    failed: number;
    isProcessing: boolean;
    currentUrl?: string;
}

export interface ParsedCSVData {
    data: CSVLinkData[];
    errors: Array<{
        row: number;
        message: string;
    }>;
}

export interface CSVUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}
