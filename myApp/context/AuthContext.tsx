import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

type User = {
    name: string;
    phone: string;
} | null;

type AuthContextType = {
    user: User;
    signIn: (phone: string) => void;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: () => { },
    signOut: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(false); // Can be used for loading states
    const router = useRouter();
    const segments = useSegments();

    const signIn = (phone: string) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setUser({ name: "User", phone });
            setIsLoading(false);
        }, 1000);
    };

    const signOut = () => {
        setUser(null);
    };

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (isLoading) return;

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace("/(auth)/login");
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace("/(tabs)");
        }
    }, [user, segments, isLoading]);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
