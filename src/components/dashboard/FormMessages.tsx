'use client';

interface FormMessagesProps {
    result: {
        slug?: string;
        url?: string;
        error?: string;
    } | null;
    copyToClipboard: (text: string) => void;
}

export default function FormMessages({ result, copyToClipboard }: FormMessagesProps) {
    if (!result) return null;

    if (result.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">
                    {result.error}
                </p>
            </div>
        );
    }

    if (result.slug && result.url) {
        return (
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
        );
    }

    return null;
}