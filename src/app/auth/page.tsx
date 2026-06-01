import AuthView from "@/src/features/auth/views/auth.view";

export default function AuthPage() {
    return (
        <section className=" flex flex-col justify-center items-center w-full h-screen bg-black">
            {/* Agregar logo de la plataforma */}
            {/* <Image src="/logo.svg" alt="Logo" width={100} height={100} /> */}
            <AuthView />
        </section>
    );
}
