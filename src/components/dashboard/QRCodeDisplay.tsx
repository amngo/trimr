'use client';

interface QRCodeDisplayProps {
    qrCodeUrl: string;
}

export default function QRCodeDisplay({ qrCodeUrl }: QRCodeDisplayProps) {
    return (
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
    );
}