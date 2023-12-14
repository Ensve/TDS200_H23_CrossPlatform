import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

export const authService = {

    // Register a new user with email and password
    async register(email: string, password: string) {
        const userCredential =  await createUserWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },

    // Login an existing user with email and password
    async login(email: string, password: string) {
        const userCredential =  await signInWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },

    // Logout the current user
    async logout() {
        return await signOut(getAuth());
    },

    // Get information about the current logged-in user
    async currentUser() {
        return getAuth().currentUser;
    },

    // Sign in with Google using OAuth
    async signinWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {

            // Sign in with Google and retrieve the user information
            const result = await signInWithPopup(getAuth(), provider);

            // Extract credential information
            const credential = GoogleAuthProvider.credentialFromResult(result);

            // Extract access token
            const token = credential?.accessToken;

            // Get the user information
            const user = result.user;
            return user;
        } catch (error) {

            // Handle errors during Google Sign-In
            console.error("Error during Google Sign-In:", error);
            return null;
        }
    }
};