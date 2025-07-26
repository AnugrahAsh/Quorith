// src/contexts/AuthContext.jsx
// This component provides user authentication state and functions to the entire app.

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
// FIXED: Changed the import path to be absolute from the project root.
import { auth, googleProvider, db } from '/src/firebase/config.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context easily
export function useAuth() {
    return useContext(AuthContext);
}

// The provider component that wraps the app
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to sign up a new user with email and password
    async function signup(email, password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create a corresponding user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
        });
        return userCredential;
    }

    // Function to log in an existing user
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Function to sign in/up with a Google account
    async function loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Check if the user is new. If so, create a document in Firestore.
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }
        return result;
    }

    // Function to log out the current user
    function logout() {
        return signOut(auth);
    }

    // Effect to listen for changes in authentication state (login/logout)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false); // Stop loading once we know the auth state
        });
        return unsubscribe; // Cleanup listener on component unmount
    }, []);

    // The value provided to all children components
    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
