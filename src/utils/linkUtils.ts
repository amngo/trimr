import { logger } from './logger';
import { BASE_URL, FAVICON_SERVICE_URL } from '@/constants';

export function formatUrl(url: string, maxLength: number = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

export function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatSlug(slug: string) {
    return `${BASE_URL}/${slug}`;
}

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        logger.error('Failed to copy to clipboard', error);
        return false;
    }
}

// Extract domain from URL
export function getDomain(url: string) {
    try {
        return new URL(url).hostname;
    } catch {
        return '';
    }
}

// Get favicon URL
export function getFaviconUrl(url: string) {
    const domain = getDomain(url);
    return `${FAVICON_SERVICE_URL}?domain=${domain}&sz=32`;
}

// Download QR code as PNG
export function downloadQRCode(id: string, filename: string): void {
    try {
        // Find the QR code SVG element on the page
        const qrCode = document.getElementById(`qr-code-${id}`);
        let qrSvg: SVGSVGElement | null = null;

        if (qrCode) {
            qrSvg = qrCode.querySelector('svg');
        }

        if (!qrSvg) {
            logger.error('QR code SVG element not found on page');
            return;
        }

        // Create canvas for high-quality export
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            logger.error('Failed to get canvas context');
            return;
        }

        // Set high resolution for quality (512x512)
        const size = 512;
        canvas.width = size;
        canvas.height = size;

        // Get SVG dimensions (qrSvg is guaranteed to be non-null here)
        const svgRect = (qrSvg as SVGSVGElement).getBoundingClientRect();
        const svgWidth = svgRect.width || 100;
        const svgHeight = svgRect.height || 100;

        // Convert SVG to image
        const svgData = new XMLSerializer().serializeToString(
            qrSvg as SVGSVGElement,
        );
        const img = new Image();
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            // Fill white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);

            // Calculate scaling to maintain aspect ratio and center the QR code
            const scale = Math.min(size / svgWidth, size / svgHeight);
            const scaledWidth = svgWidth * scale;
            const scaledHeight = svgHeight * scale;
            const x = (size - scaledWidth) / 2;
            const y = (size - scaledHeight) / 2;

            // Draw the QR code image centered
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

            // Download the canvas as PNG
            canvas.toBlob((blob) => {
                if (blob) {
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${filename}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(downloadUrl);
                    logger.info(`QR code downloaded as ${filename}.png`);
                }
            }, 'image/png');

            URL.revokeObjectURL(url);
        };

        img.onerror = () => {
            logger.error('Failed to load SVG image for QR code download');
            URL.revokeObjectURL(url);
        };

        img.src = url;
    } catch (error) {
        logger.error('Failed to download QR code:', error);
    }
}
