'use client';

import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
    qrCodeUrl: string;
}

export default function QRCodeDisplay({ qrCodeUrl }: QRCodeDisplayProps) {
    return (
        <div className="bg-white border-3 border-dashed border-base-300 rounded-lg p-4 flex items-center justify-center">
            <QRCode value={qrCodeUrl} className="w-full h-full" level="L" />
        </div>
    );
}
