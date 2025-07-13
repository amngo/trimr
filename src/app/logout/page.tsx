'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function LogoutPage() {
    const { data: session, isPending } = useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isSignedOut, setIsSignedOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            if (session && !isSigningOut && !isSignedOut) {
                setIsSigningOut(true);
                try {
                    await signOut();
                    setIsSignedOut(true);
                } catch (error) {
                    console.error('Logout failed:', error);
                } finally {
                    setIsSigningOut(false);
                }
            }
        };

        handleLogout();
    }, [session, isSigningOut, isSignedOut]);

    // Redirect after 3 seconds
    useEffect(() => {
        if (isSignedOut) {
            const timer = setTimeout(() => {
                router.push('/auth');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSignedOut, router]);

    if (isPending || isSigningOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="card w-96 bg-base-100 border border-base-300">
                    <div className="card-body text-center">
                        <div className="flex justify-center mb-4">
                            <LogOut className="w-12 h-12 text-primary animate-pulse" />
                        </div>
                        <h2 className="card-title justify-center text-2xl">
                            Signing you out...
                        </h2>
                        <p className="text-base-content/70">
                            Please wait while we sign you out safely.
                        </p>
                        <div className="flex justify-center mt-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isSignedOut || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="card w-96 bg-base-100 border border-base-300">
                    <div className="card-body text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-12 h-12 text-success" />
                        </div>
                        <h2 className="card-title justify-center text-2xl text-success">
                            Successfully signed out!
                        </h2>
                        <p className="text-base-content/70 mb-4">
                            You have been safely signed out of your account.
                        </p>
                        <div className="card-actions justify-center">
                            <Link href="/auth" className="btn btn-primary">
                                Sign In Again
                            </Link>
                            <Link href="/" className="btn btn-ghost">
                                Go Home
                            </Link>
                        </div>
                        <p className="text-sm text-base-content/50 mt-4">
                            Redirecting to sign in page in 3 seconds...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
