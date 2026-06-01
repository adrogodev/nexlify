import { useCallback, useState } from "react";
import { AuthApi } from "../auth.api";
import type { IAuthApiResponseObject } from "../objects";

export function useAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<IAuthApiResponseObject | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const [authApi] = useState(() => new AuthApi());

  const handleClick = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    const response = await authApi.User({ username, password });

    if (response.ok) console.log("Auth response:", response);
    if (!response.ok || !response.data) {
      console.error("Auth error:", {
        code: response.code,
        message: response.message,
        errors: response.errors,
      });
      setError(response.message);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setUser(response.data);
    setToken(response.data.token);
    setIsAuthenticated(true);
    setError(null);
    setIsLoading(false);
  }, [username, password, authApi]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    username,
    handleUsernameChange,
    password,
    handlePasswordChange,
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    handleClick,
    logout,
  };
}
