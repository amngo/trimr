'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if (isPending) {
        return <div className="skeleton h-10 w-20"></div>;
    }

    if (session) {
        return (
            <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle">
                    <div className="size-10 flex items-center justify-center">
                        {session.user?.image ? (
                            <img src={session.user.image} alt="User avatar" />
                        ) : (
                            <User />
                        )}
                    </div>
                </button>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                    <li>
                        <div className="justify-between">
                            {session.user?.name || session.user?.email}
                        </div>
                    </li>
                    <li>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <button
                            onClick={async () => {
                                await signOut();
                                router.push('/auth');
                            }}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <Link href="/auth" className="btn btn-primary">
            Sign In
        </Link>
    );
}
