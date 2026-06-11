import AuthTemplate from "@/src/features/auth/template/auth.template";


export default function AuthPage() {
    return (
        <section>
            <h1 className="absolute top-5 left-10 z-10 text-3xl font-bold">nexlify</h1>
            <section className=" flex flex-col justify-center items-center w-full h-screen">
                <AuthTemplate />
            </section>
        </section>
    );
}
