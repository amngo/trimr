'use client';
import { useState, useEffect } from 'react';
import { signIn, signUp, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { data: session, isPending } = useSession();
    const router = useRouter();

    // Redirect to dashboard if already signed in
    useEffect(() => {
        if (session && !isPending) {
            router.push('/dashboard');
        }
    }, [session, isPending, router]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear any previous errors

        try {
            if (isLogin) {
                const { error } = await signIn.email({
                    email,
                    password,
                });
                if (error) throw new Error(error.message);
            } else {
                const { error } = await signUp.email({
                    email,
                    password,
                    name,
                });
                if (error) throw new Error(error.message);
            }
            // Redirect to dashboard after successful auth
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Authentication failed');
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('An unexpected error occurred during authentication');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(''); // Clear any previous errors

        try {
            if (provider === 'google') {
                const { error } = await signIn.social({
                    provider: 'google',
                    callbackURL: '/dashboard',
                });
                if (error) throw new Error(error.message);
            } else {
                const { error } = await signIn.social({
                    provider: 'github',
                    callbackURL: '/dashboard',
                });
                if (error) throw new Error(error.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Social authentication failed');
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError(
                    'An unexpected error occurred during social authentication'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking session
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // Don't render auth form if already authenticated (will redirect)
    if (session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-center justify-center text-2xl mb-6">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h2>

                    {error && (
                        <div className="alert alert-error alert-soft mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <fieldset className="fieldset">
                            {!isLogin && (
                                <>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="input w-full"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required={!isLogin}
                                    />
                                </>
                            )}
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </fieldset>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Loading...'
                                    : isLogin
                                    ? 'Sign In'
                                    : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="space-y-2">
                        <button
                            disabled={isLoading}
                            onClick={() => handleSocialAuth('google')}
                            className="btn bg-white text-black border-[#e5e5e5] w-full"
                        >
                            <svg
                                aria-label="Google logo"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <g>
                                    <path d="m0 0H512V512H0" fill="#fff"></path>
                                    <path
                                        fill="#34a853"
                                        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                                    ></path>
                                    <path
                                        fill="#4285f4"
                                        d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                                    ></path>
                                    <path
                                        fill="#fbbc02"
                                        d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                                    ></path>
                                    <path
                                        fill="#ea4335"
                                        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                                    ></path>
                                </g>
                            </svg>
                            Login with Google
                        </button>

                        <button
                            disabled={isLoading}
                            onClick={() => handleSocialAuth('github')}
                            className="btn bg-black text-white border-black w-full"
                        >
                            <svg
                                aria-label="GitHub logo"
                                width="16"
                                height="16"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="white"
                                    d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                                ></path>
                            </svg>
                            Login with GitHub
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(''); // Clear error when switching modes
                            }}
                            className="link link-primary"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
