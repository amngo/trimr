import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import {
    BarChart3,
    Shield,
    QrCode,
    Calendar,
    Upload,
    Search,
    Download,
    Globe,
    Clock,
} from 'lucide-react';

export default async function LandingPage() {
    const user = await getCurrentUser();

    if (user) {
        // Redirect authenticated users to dashboard
        redirect('/dashboard');
    }

    const features = [
        // {
        //     icon: LinkIcon,
        //     title: 'Smart Link Shortening',
        //     description:
        //         'Create custom short links with intelligent slug generation and collision detection.',
        // },
        {
            icon: BarChart3,
            title: 'Detailed Analytics',
            description:
                'Track clicks, unique visitors, geographic data, and daily activity with beautiful charts.',
        },
        {
            icon: Shield,
            title: 'Password Protection',
            description:
                'Secure your links with password protection and user-based access control.',
        },
        {
            icon: QrCode,
            title: 'QR Code Generation',
            description:
                'Automatic QR code creation with high-quality PNG download capability.',
        },
        {
            icon: Calendar,
            title: 'Scheduling & Expiration',
            description:
                'Set start dates and expiration times with smart status indicators.',
        },
        {
            icon: Upload,
            title: 'Bulk Operations',
            description:
                'Upload up to 1,000 links via CSV and manage multiple links with bulk actions.',
        },
        {
            icon: Search,
            title: 'Advanced Filtering',
            description:
                'Search and filter links by status, date, clicks, and custom criteria.',
        },
        // {
        //     icon: Users,
        //     title: 'User Management',
        //     description:
        //         'Secure authentication with Google and GitHub, plus user-specific dashboards.',
        // },
        {
            icon: Download,
            title: 'Export & Share',
            description:
                'Download QR codes, export data, and share links with professional formatting.',
        },
        // {
        //     icon: Zap,
        //     title: 'Real-time Updates',
        //     description:
        //         'Live click tracking, instant status changes, and responsive interface.',
        // },
        {
            icon: Globe,
            title: 'Geographic Insights',
            description:
                'Track visitor locations with country-based analytics and top regions display.',
        },
        {
            icon: Clock,
            title: 'Link Lifecycle',
            description:
                'Complete control over link status with enable/disable and expiration management.',
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-6xl font-bold text-primary mb-4">
                            trimr
                        </h1>
                        <h2 className="text-3xl font-semibold mb-6">
                            Professional Link Management
                        </h2>
                        <p className="text-xl text-base-content/80 mb-8 leading-relaxed">
                            Create, track, and manage short links with powerful
                            analytics, QR codes, bulk operations, and enterprise
                            features. Perfect for businesses, marketers, and
                            developers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth"
                                className="btn btn-primary btn-lg"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="#features"
                                className="btn btn-outline btn-lg"
                            >
                                View Features
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Everything you need for link management
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                            From basic link shortening to advanced analytics and
                            bulk operations, trimr provides all the tools you
                            need to manage your links professionally.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="card-title text-lg">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-base-content/70">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            {/* <section className="py-20 px-4 bg-primary/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to streamline your link management?
                    </h2>
                    <p className="text-xl text-base-content/80 mb-8">
                        Join thousands of users who trust trimr for their link
                        shortening and analytics needs.
                    </p>
                    <Link href="/auth" className="btn btn-primary btn-lg">
                        Start Using trimr Today
                    </Link>
                </div>
            </section> */}
        </div>
    );
}
