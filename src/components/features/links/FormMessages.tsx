'use client';

interface FormMessagesProps {
    result: {
        slug?: string;
        url?: string;
        error?: string;
    } | null;
}

export default function FormMessages({ result }: FormMessagesProps) {
    if (!result) return null;

    if (result.error) {
        return (
            <div role="alert" className="alert alert-error alert-soft">
                <span>{result.error}</span>
            </div>
        );
    }

    return null;
}
