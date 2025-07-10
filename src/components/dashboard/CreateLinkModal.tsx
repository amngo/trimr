'use client';

import { useState, useRef, useEffect } from 'react';
import { createLink } from '@/app/actions';
import QRCode from 'qrcode';

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLinkModal({
    isOpen,
    onClose,
}: CreateLinkModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        slug?: string;
        url?: string;
        error?: string;
    } | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [expiration, setExpiration] = useState('never');
    const formRef = useRef<HTMLFormElement>(null);

    const shortUrl = result?.slug
        ? `was.do/${result.slug}`
        : customSlug
        ? `was.do/${customSlug}`
        : 'was.do/selcan';

    useEffect(() => {
        if (shortUrl) {
            QRCode.toDataURL(
                shortUrl,
                { width: 120, margin: 1 },
                (err, url) => {
                    if (!err) {
                        setQrCodeUrl(url);
                    }
                }
            );
        }
    }, [shortUrl]);

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await createLink(formData);
            if (response?.error) {
                setResult({ error: response.error });
            } else if (response?.success) {
                setResult({ slug: response.slug, url: response.url });
            }
        } catch (error) {
            console.error('Error creating link:', error);
            setResult({ error: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form after a delay to allow modal to close smoothly
        setTimeout(() => {
            setUrl('');
            setCustomSlug('');
            setExpiration('never');
            setResult(null);
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Create New Link
                    </h2>

                    <form
                        ref={formRef}
                        action={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Destination URL */}
                        <div>
                            <label
                                htmlFor="url"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Destination URL
                            </label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Add link"
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Shorten Key */}
                        <div>
                            <label
                                htmlFor="customSlug"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Shorten Key
                            </label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    was.do
                                </span>
                                <input
                                    type="text"
                                    id="customSlug"
                                    name="customSlug"
                                    value={customSlug}
                                    onChange={(e) =>
                                        setCustomSlug(e.target.value)
                                    }
                                    placeholder="(optional)"
                                    className="flex-1 px-3 py-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Expiration */}
                        <div>
                            <label
                                htmlFor="expiration"
                                className="block text-sm font-medium text-gray-900 mb-2"
                            >
                                Expiration
                            </label>
                            <div className="relative">
                                <select
                                    id="expiration"
                                    name="expiration"
                                    value={expiration}
                                    onChange={(e) =>
                                        setExpiration(e.target.value)
                                    }
                                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                    disabled={isLoading}
                                >
                                    <option value="never">Never</option>
                                    <option value="1h">1 Hour</option>
                                    <option value="24h">24 Hours</option>
                                    <option value="7d">7 Days</option>
                                    <option value="30d">30 Days</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* QR Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    QR Code
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-32">
                                    {qrCodeUrl ? (
                                        <img
                                            src={qrCodeUrl}
                                            alt="QR Code"
                                            className="h-24 w-24"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-sm">
                                            QR Code will appear here
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {result?.error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">
                                    {result.error}
                                </p>
                            </div>
                        )}

                        {result?.slug && result?.url && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                <p className="text-sm text-green-600 mb-2">
                                    Link created successfully!
                                </p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={`${process.env.NEXT_PUBLIC_BASE_URL}/${result.slug}`}
                                        readOnly
                                        className="flex-1 px-2 py-1 text-sm border border-green-300 rounded bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(
                                                `${process.env.NEXT_PUBLIC_BASE_URL}/${result.slug}`
                                            )
                                        }
                                        className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !url}
                            >
                                {isLoading ? 'Creating...' : 'Create New Link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
