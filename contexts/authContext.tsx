import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter()

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName
                });
                updateUserData(firebaseUser.uid)
                router.replace("/(tabs)")
            } else {
                setUser(null)
                router.replace("/(auth)/welcome")

            }
        })
        return () => unsub()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return { success: true }
        } catch (error: any) {
            let msg = error.message
            if (msg.includes("invalid-credential")) msg = "Wrong Credentials"
            if (msg.includes("invalid-email")) msg = "Invalid Email"

            return { success: false, msg }
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            let response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            await setDoc(doc(firestore, "users", response?.user?.uid), {
                name,
                email,
                uid: response?.user?.uid
            })
            return { success: true }
        } catch (error: any) {
            let msg = error.message
            if (msg.includes("email-already-in-use")) msg = "Email already exists"
            if (msg.includes("invalid-email")) msg = "Invalid Email"
            return { success: false, msg }
        }
    }

    const updateUserData = async (uid: string) => {
        try {

            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                const userData: UserType = {
                    uid: data?.uid,
                    email: data?.email || null,
                    name: data?.name || null,
                    image: data?.image || null,
                }
                setUser(userData)
            }
        } catch (error: any) {
            console.log(error);

        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be wrapper inside AuthProvider")
    }
    return context
}