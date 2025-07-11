'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AuthButton() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="skeleton h-10 w-20"></div>
        );
    }

    if (session) {
        return (
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        {session.user?.image ? (
                            <img src={session.user.image} alt="User avatar" />
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
                        <button onClick={() => signOut()}>
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