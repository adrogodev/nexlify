import AuthView from "@/src/features/auth/views/auth.view";

export default function AuthPage() {
    return (
        <section>
            <h1 className="absolute top-5 left-10 z-10 text-3xl font-bold text-white">nexlify</h1>
            <section className=" flex flex-col justify-center items-center w-full h-screen bg-black">
                <AuthView />
            </section>
        </section>
    );
}
