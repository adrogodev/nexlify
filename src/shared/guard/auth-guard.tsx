"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
// import { useAuthGuard } from "./hooks";
import { DashboardSkeleton } from "../components";
import { useAppDispatch, useAppSelector } from "../stores";
import { getUserData, selectUserData } from "../stores/slices";

export function AuthGuard({ children }: { children: React.ReactNode }) {

    // const { session, unauthenticated, dispatch, router } = useAuthGuard();

    const _dispatch = useAppDispatch();
    const { status, user_state } = useAppSelector(selectUserData);

    const pathname = usePathname();

    useEffect(() => {
        if (status !== 'idle') return;
        _dispatch(getUserData());
    }, [_dispatch, status])

    const isLoading = (status === 'loading' || status === 'idle');
    const isRedirectingToDashboard = user_state === 'authenticated' && pathname.includes('/auth');

    if (isLoading) {
        if (pathname.includes('/dashboard') || isRedirectingToDashboard) {
            return <DashboardSkeleton />
        }
    }

    return (
        <>
            {children}
        </>
    )

}