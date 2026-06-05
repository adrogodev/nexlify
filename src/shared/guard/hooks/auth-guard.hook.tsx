import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "../../stores";
import { logout } from "../../stores/slices";

export function useAuthGuard() {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const session = searchParams.get('session') === 'expired';
    const unauthenticated = searchParams.get('session') === 'unauthenticated';

    useEffect(() => {
        if (unauthenticated) {
            dispatch(logout());
            router.replace('/sign-in');
        }
        if (session) {
            dispatch(logout());
            toast.error('Su sesión ha expirado, por favor, inicie sesión nuevamente para continuar.');
            router.replace('/sign-in');
        }

    }, [session, unauthenticated, dispatch, router]);

    return {
        session,
        unauthenticated,
        dispatch,
        router
    };
}
