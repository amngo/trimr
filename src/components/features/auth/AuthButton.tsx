'use client';

import { useSession } from '@/lib/auth-client';
import { LogOut, UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function AuthButton() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return <div className="skeleton size-10 rounded-full"></div>;
    }

    if (session) {
        return (
            <div className="dropdown dropdown-top">
                <button className="cursor-pointer grid grid-cols-[auto_1fr] grid-rows-2 items-center justify-items-start px-4 py-4 rounded-lg bg-base-300 w-full gap-x-2">
                    <div className="row-span-2">
                        {session.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="User avatar"
                                className="size-8 rounded-full"
                            />
                        ) : (
                            <div className="avatar avatar-placeholder bg-neutral rounded-full size-8">
                                <div>
                                    <UserIcon className="text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                    <span className="text-xs self-start font-medium max-w-[200px] truncate">
                        {session.user?.name}
                    </span>
                    <span className="text-xs text-base-content/70 font-light max-w-[200px] truncate">
                        {session.user?.email}
                    </span>
                </button>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                    <li>
                        <Link href="/logout">
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </Link>
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
