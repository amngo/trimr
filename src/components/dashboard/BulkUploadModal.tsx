'use client';

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { CSVUploadModalProps, ParsedCSVData, BulkUploadResult } from '@/types';
import { parseCSVText, downloadSampleCSV } from '@/utils/csvParser';
import { useBulkUpload } from '@/hooks/useBulkUpload';

export default function BulkUploadModal({
    isOpen,
    onClose,
}: CSVUploadModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);
    const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(
        null
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const { bulkUpload, progress, isUploading } = useBulkUpload({
        onComplete: (result: BulkUploadResult) => {
            setUploadResult(result);
        },
    });

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const csvFile = files.find(
            (file) =>
                file.type === 'text/csv' ||
                file.name.toLowerCase().endsWith('.csv')
        );

        if (csvFile) {
            handleFileSelect(csvFile);
        }
    }, []);

    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setUploadResult(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target?.result as string;
            if (csvText) {
                const parsed = parseCSVText(csvText);
                setParsedData(parsed);
            }
        };
        reader.readAsText(selectedFile);
    }, []);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!parsedData?.data.length) return;

        await bulkUpload(parsedData.data);
    };

    const handleClose = () => {
        setFile(null);
        setParsedData(null);
        setUploadResult(null);
        onClose();
    };

    const renderUploadArea = () => (
        <div
            className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-base-300 hover:border-primary/50'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <Upload className="mx-auto h-12 w-12 text-base-content/40 mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">
                Upload CSV File
            </h3>
            <p className="text-base-content/60 mb-4">
                Drag and drop your CSV file here, or click to browse
            </p>
            <Button
                variant="primary"
                onClick={() => inputRef.current?.click()}
                className="mb-4"
            >
                Choose File
            </Button>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileInputChange}
                className="hidden"
            />
            <div className="text-sm text-base-content/50">
                <button
                    type="button"
                    onClick={downloadSampleCSV}
                    className="text-primary hover:text-primary-focus underline"
                >
                    Download sample CSV
                </button>
                {' | '}
                CSV format: url, customSlug (optional), expiration (optional)
            </div>
        </div>
    );

    const renderFilePreview = () => {
        if (!file || !parsedData) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-base-content/60">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setFile(null);
                            setParsedData(null);
                        }}
                    >
                        Remove
                    </Button>
                </div>

                {/* Parsing Results */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="font-medium text-success">
                                Valid Links
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-success">
                            {parsedData.data.length}
                        </p>
                    </div>

                    {parsedData.errors.length > 0 && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-error" />
                                <span className="font-medium text-error">
                                    Errors
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-error">
                                {parsedData.errors.length}
                            </p>
                        </div>
                    )}
                </div>

                {/* Error Details */}
                {parsedData.errors.length > 0 && (
                    <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                        <h4 className="font-medium text-error mb-2">
                            Errors Found:
                        </h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {parsedData.errors
                                .slice(0, 10)
                                .map((error, index) => (
                                    <p
                                        key={index}
                                        className="text-sm text-base-content/70"
                                    >
                                        Row {error.row}: {error.message}
                                    </p>
                                ))}
                            {parsedData.errors.length > 10 && (
                                <p className="text-sm text-base-content/50 italic">
                                    ...and {parsedData.errors.length - 10} more
                                    errors
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                {parsedData.data.length > 0 && (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleUpload}
                        disabled={isUploading}
                        loading={isUploading}
                        className="w-full"
                    >
                        {isUploading
                            ? `Uploading... (${progress.processed}/${progress.total})`
                            : `Upload ${parsedData.data.length} Links`}
                    </Button>
                )}
            </div>
        );
    };

    const renderProgress = () => {
        if (!isUploading && !uploadResult) return null;

        return (
            <div className="space-y-4">
                {isUploading && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                                Processing Links
                            </span>
                            <span className="text-sm text-base-content/60">
                                {progress.processed} / {progress.total}
                            </span>
                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value={progress.processed}
                            max={progress.total}
                        />
                        {progress.currentUrl && (
                            <p className="text-xs text-base-content/60 mt-1 truncate">
                                Current: {progress.currentUrl}
                            </p>
                        )}
                    </div>
                )}

                {uploadResult && (
                    <div className="bg-base-200 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Upload Complete</h4>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-base-content">
                                    {uploadResult.total}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    Total
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-success">
                                    {uploadResult.successful}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    Success
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-error">
                                    {uploadResult.failed}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    Failed
                                </p>
                            </div>
                        </div>

                        {uploadResult.errors &&
                            uploadResult.errors.length > 0 && (
                                <div className="bg-error/5 border border-error/20 rounded p-3">
                                    <h5 className="text-sm font-medium text-error mb-2">
                                        Failed Uploads:
                                    </h5>
                                    <div className="max-h-24 overflow-y-auto space-y-1">
                                        {uploadResult.errors
                                            .slice(0, 5)
                                            .map((error, index) => (
                                                <p
                                                    key={index}
                                                    className="text-xs text-base-content/70"
                                                >
                                                    {error.url}: {error.error}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog
                    static
                    className="relative z-50"
                    onClose={handleClose}
                    open={isOpen}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/25"
                    />

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <DialogPanel
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-2xl transform overflow-hidden rounded bg-base-100 p-8 shadow"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <DialogTitle
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-base-content"
                                    >
                                        Bulk Upload Links
                                    </DialogTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        shape="square"
                                        onClick={handleClose}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {!file && renderUploadArea()}
                                    {file && renderFilePreview()}
                                    {renderProgress()}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button
                                        variant="ghost"
                                        onClick={handleClose}
                                        disabled={isUploading}
                                    >
                                        {uploadResult ? 'Close' : 'Cancel'}
                                    </Button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
