export function PlaceholderComponent({ name, username }: { name: string, username: string }) {
    return (
        <section className="flex flex-col justify-center p-2">
            <p className="text-sm font-bold">{name}</p>
            <p className="text-xs">{username}</p>

        </section>
    )
}