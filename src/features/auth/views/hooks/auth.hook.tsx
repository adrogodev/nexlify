import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { authAction } from "../../actions";

export function useAuth() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    setError(null);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setError(null);
  }, []);

  const handleClick = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const action = await authAction({ username, password });
      if (!action.ok) {
        console.log(action);

        setError(action.error ?? 'Error desconocido');
        return;
      }
      router.push("/home");
    } catch (err) {
      console.error("Network error:", err);
      setError("Error de conexión, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, [username, password, router]);

  return {
    username,
    handleUsernameChange,
    password,
    handlePasswordChange,
    isLoading,
    error,
    handleClick,
  };
}
