import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAppDispatch } from "@/src/shared/stores";
import { getUserData } from "@/src/shared/stores/slices/auth.slice";
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

  const dispatch = useAppDispatch();

  const handleClick = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const action = await authAction({ username, password });
      if (!action.ok) {
        // console.log(action);
        setError(action.error ?? 'Error desconocido');
        return;
      }

      await dispatch(getUserData());
      router.push("/dashboard");
    } catch (err) {
      console.error("Network error:", err);
      setError("Error de conexión, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, [username, password, router, dispatch]);

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
