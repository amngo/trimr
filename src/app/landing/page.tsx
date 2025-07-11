import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Link Shortener</h1>
                    <p className="py-6">
                        Create short, shareable links with detailed analytics and customization options.
                    </p>
                    <div className="space-x-4">
                        <Link href="/auth" className="btn btn-primary">
                            Get Started
                        </Link>
                        <Link href="/dashboard" className="btn btn-outline">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}