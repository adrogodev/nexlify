import { useAppSelector } from "@/src/shared/stores";
import { selectUserData } from "@/src/shared/stores/slices/auth.slice";

export function PlaceholderComponent() {
    const { data: user, user_state } = useAppSelector(selectUserData);

    if (user_state !== 'authenticated' || !user) return null;

    const slice: string[] = user.name!.trim().split(" ").filter(Boolean).slice(0, 2);
    const capitalizer: string = slice.map(word => word[0].toUpperCase()).join("");

    return (
        <section className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-500 rounded-full shadow-sm shadow-white/50">
                <p className="text-sm font-extrabold">{capitalizer}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs italic">{user.username}</p>
            </div>
        </section>
    )
}