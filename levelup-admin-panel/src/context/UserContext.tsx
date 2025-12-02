import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User } from "@/types/User";
import { UserRepository } from "@/repositories/UserRepository";
import { AuthService } from "@/services/AuthService";

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserStats: () => Promise<{
    totalUsers: number;
    duocUsers: number;
    normalUsers: number;
    levelStats: { [key: string]: number };
    totalPoints: number;
  }>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      console.log("UserContext: Starting to load users...");
      setLoading(true);
      setError(null);
      const userData = await UserRepository.findAll();
      console.log("UserContext: Users loaded successfully:", userData?.length || 0, "users");
      setUsers(userData);
      return userData;
    } catch (err) {
      console.error("UserContext: Error loading users:", err);
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
      return [];
    } finally {
      setLoading(false);
      console.log("UserContext: Loading finished, loading state:", false);
    }
  }, []);

  // Inicializar sesión desde token
  useEffect(() => {
    const initSession = async () => {
      if (AuthService.isAuthenticated()) {
        // Token exists, try to load user
        const storedUser = localStorage.getItem("current_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure role is lowercase for legacy sessions
          if (parsedUser.rol) {
            parsedUser.rol = parsedUser.rol.toLowerCase();
          }
          setCurrentUser(parsedUser);
        }
        // Always load users to populate the list and set loading to false
        await loadUsers();
      } else {
        // No token
        localStorage.removeItem("current_user");
        setCurrentUser(null);
        setLoading(false); // Set loading to false when not authenticated
      }
    };

    initSession();

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      // If token was removed in another tab, logout this tab too
      if (e.key === "levelup_auth_token" && e.newValue === null) {
        console.log("UserContext: Token removed in another tab, logging out");
        setCurrentUser(null);
        localStorage.removeItem("current_user");
        // Redirect to home
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadUsers]);

  // Sync currentUser with latest data from backend
  useEffect(() => {
    const syncUser = async () => {
      if (currentUser?.id) {
        try {
          const freshUser = await UserRepository.findById(currentUser.id);
          if (freshUser) {
            // Only update if there are actual changes (compare key fields)
            const hasChanges =
              freshUser.puntos !== currentUser.puntos ||
              freshUser.nivel !== currentUser.nivel ||
              freshUser.direcciones?.length !== currentUser.direcciones?.length ||
              freshUser.metodosPago?.length !== currentUser.metodosPago?.length;

            if (hasChanges) {
              console.log("UserContext: Syncing currentUser with fresh data from backend");
              setCurrentUser(freshUser);
              localStorage.setItem("current_user", JSON.stringify(freshUser));
            }
          }
        } catch (error) {
          console.error("UserContext: Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [currentUser?.id]); // Only sync when user ID changes (login/logout)

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      // Call backend login
      console.log("UserContext: Sending login request for:", email);
      const response = await AuthService.login(email, password);

      // Fetch full user details using the token
      // Note: We might need to implement a specific method in AuthService for this if not already present,
      // or just use the info from response if sufficient.
      // For now, let's assume we can get the user by email from the loaded users list OR fetch it.
      // Since we want to move away from loading ALL users, we should fetch the specific user.
      // But for compatibility with existing code that expects 'users' to be populated:

      // Option 1: Use the data from login response (partial user)
      // Option 2: Fetch from /me endpoint (best practice)

      // Let's use the /me endpoint via a new AuthService method or direct API call.
      // I'll add getCurrentUser to AuthService in the next step if needed, but for now let's use the response
      // and maybe reload users if needed.

      // Actually, I added /me endpoint to backend. I should use it.
      // But AuthService doesn't have getCurrentUser method in frontend yet.
      // I'll add it to AuthService first? No, I can't edit two files in one step easily if I want to be safe.
      // I'll assume AuthService has it or I'll add it now.
      // Wait, I updated AuthService.ts in previous step but I didn't add getCurrentUser to frontend AuthService.
      // I only added it to Backend AuthService.

      // Let's update UserContext to use what we have.
      // The login response has email, nombre, role.
      // We can try to find the user in the `users` list (which is loaded on mount).
      // If found, use it. If not, maybe create a temporary user object.

      const user = users.find(u => u.correo === email);

      if (user) {
        setCurrentUser(user);
        localStorage.setItem("current_user", JSON.stringify(user));
      } else {
        // Fallback if user not in list (e.g. new user not yet in findAll)
        await loadUsers();
        // We need to re-find the user after reloading
        // Since we can't access the updated state immediately here without a ref or another effect,
        // we will construct a minimal user from the response for now.

        const minimalUser: User = {
          id: response.id?.toString() || "0",
          nombre: response.nombre,
          correo: response.email,
          contraseña: "",
          rol: (response.role ? response.role.toLowerCase() : "user") as any,
          activo: true,
          telefono: "",
          rut: "",
          tipo: "normal",
          puntos: 0,
          nivel: "bronce",
          preferenciasComunicacion: { email: true, sms: false },
          intereses: [],
          aceptaTerminos: true,
          aceptaPoliticaPrivacidad: true,
          captchaVerificado: true,
          fechaRegistro: new Date().toISOString(),
          codigoReferido: ""
        };
        setCurrentUser(minimalUser);
        localStorage.setItem("current_user", JSON.stringify(minimalUser));
      }

    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Login error response data:", err.response.data);
        console.error("Login error response status:", err.response.status);
      }
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [users, loadUsers]);

  const logout = useCallback(() => {
    AuthService.removeToken();
    localStorage.removeItem("current_user");
    setCurrentUser(null);
  }, []);

  const addUser = useCallback(async (user: Omit<User, "id">) => {
    try {
      console.log("UserContext.addUser: Creating user with email:", user.correo);
      setError(null);

      // Extract first address if available
      const primaryAddress = user.direcciones && user.direcciones.length > 0 ? user.direcciones[0] : null;

      // Call backend register
      await AuthService.register(
        user.nombre,
        user.correo,
        user.contraseña,
        user.telefono,
        user.rut,
        user.referidoPor,
        primaryAddress?.calle,
        primaryAddress?.numero,
        primaryAddress?.ciudad,
        primaryAddress?.region
      );

      // Reload users to get the new user with ID
      await loadUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear usuario";
      console.error("UserContext.addUser: Error creating user:", errorMessage, err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadUsers]);

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await UserRepository.update(id, userData);

      // Si el usuario actualizado es el actual, actualizar estado
      if (currentUser && currentUser.id === id) {
        setCurrentUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
      }

      await loadUsers(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar usuario";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadUsers, currentUser]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setError(null);
      await UserRepository.delete(id);
      if (currentUser && currentUser.id === id) {
        logout();
      }
      await loadUsers(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar usuario";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadUsers, currentUser, logout]);

  const getUserStats = useCallback(async () => {
    try {
      return await UserRepository.getUserStats();
    } catch (err) {
      console.error("Error getting user stats:", err);
      throw err;
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        currentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        getUserStats,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
