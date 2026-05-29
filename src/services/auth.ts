import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import { AuthResponse } from "../types";

export const authService = {
    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al registrarse");
        }

        const data: AuthResponse = await response.json();
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        return data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al iniciar sesión");
        }

        const data: AuthResponse = await response.json();
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        return data;
    },

    async logout(): Promise<void> {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    },

    async getToken(): Promise<string | null> {
        return AsyncStorage.getItem("token");
    },

    async getUser(): Promise<AuthResponse["user"] | null> {
        const user = await AsyncStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },
};
