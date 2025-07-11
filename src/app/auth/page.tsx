'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth-client';
import { Github, Mail } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signIn.email({
                    email,
                    password,
                });
            } else {
                await signUp.email({
                    email,
                    password,
                    name,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError('');

        try {
            if (provider === 'google') {
                await signIn.social({
                    provider: 'google',
                });
            } else {
                await signIn.social({
                    provider: 'github',
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-center justify-center text-2xl mb-6">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h2>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input input-bordered w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="space-y-2">
                        <button
                            onClick={() => handleSocialAuth('google')}
                            className="btn btn-outline w-full"
                            disabled={isLoading}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSocialAuth('github')}
                            className="btn btn-outline w-full"
                            disabled={isLoading}
                        >
                            <Github className="w-4 h-4 mr-2" />
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="link link-primary"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}