'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const slug = params.slug as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`/api/links/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, id: slug }),
            });

            if (response.ok) {
                // Redirect to the link with password verification flag
                window.location.href = `/${slug}?password_verified=true`;
            } else {
                const data = await response.json();
                setError(data.error || 'Incorrect password');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="mb-8 w-full">
                    <Lock size={64} className="text-primary mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-base-content mb-4">
                        Password Required
                    </h1>
                    <p className="text-lg text-base-content/70 mb-6">
                        This link is password protected. Please enter the
                        password to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`input input-bordered w-full pr-12 ${
                                    error ? 'input-error' : ''
                                }`}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isLoading || !password.trim()}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Access Link'
                            )}
                        </button>
                    </form>

                    <p className="text-sm text-base-content/60 mt-4">
                        Link: <span className="font-mono">/{slug}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
