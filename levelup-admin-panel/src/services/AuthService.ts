import api from "./api";
import { User } from "@/types/User";

export interface AuthResponse {
    id: number;
    token: string;
    email: string;
    nombre: string;
    role: string;
    activo: boolean;
}

export class AuthService {
    private static readonly TOKEN_KEY = "levelup_auth_token";

    static async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", { email, password });
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    }

    static async register(nombre: string, email: string, password: string, telefono?: string, rut?: string, codigoReferido?: string, calle?: string, numero?: string, ciudad?: string, region?: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register", { nombre, email, password, telefono, rut, codigoReferido, calle, numero, ciudad, region });
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    }

    static setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static logout(): void {
        this.removeToken();
    }
}

