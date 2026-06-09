"use client";

import { useAuth } from "./hooks/auth.hook";

export default function AuthTemplate() {
  const {
    username,
    handleUsernameChange,
    password,
    handlePasswordChange,
    handleClick,
    isLoading,
    error,
  } = useAuth();

  return (
    <section className="select-none">
      <h1 className="font-bold text-xl text-center mb-0.5">Iniciar sesión</h1>
      <p className="italic text-xs text-center">Bienvenido a Nexlify</p>
      <section>
        <p className="text-sm mt-3">Usuario</p>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          placeholder="Ingrese su nombre de usuario"
          className="w-60 border border-gray-500 rounded-md p-1.5 mt-1.5 text-xs focus:bg-transparent focus:outline-none" />
        <p className="text-sm mt-3">Contraseña</p>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="Ingrese su contraseña"
          className="w-60 border border-gray-500 rounded-md p-1.5 mt-1.5 text-xs focus:outline-none" />
        <div className="h-5 mt-3 flex items-center">
          {error != null && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      </section>
      <section className="mt-6  flex justify-center">
        <button type="button"
          onClick={handleClick}
          className="text-white w-40 cursor-pointer text-sm p-1.5 bg-transparent border border-gray-500 shadow-sm shadow-white/50 rounded-md active:scale-95 transition-transform duration-150">Iniciar sesión</button>
      </section>
    </section>
  );
}
