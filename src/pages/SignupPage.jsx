import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// 3D Imports for the background effect
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';

// This component is for the 3D scene. It's defined here to keep everything in one file.
function Scene3D() {
    // This component defines a single, rotating 3D shape.
    function AnimatedShape(props) {
        const meshRef = useRef();
        // Rotate the shape on every frame for a continuous animation
        useFrame((state, delta) => {
            if (meshRef.current) {
                meshRef.current.rotation.x += delta * 0.1;
                meshRef.current.rotation.y += delta * 0.15;
            }
        });

        return (
            <group {...props}>
                <Icosahedron ref={meshRef} args={[1, 0]}>
                    <meshStandardMaterial color="white" wireframe />
                </Icosahedron>
            </group>
        );
    }

    return (
        <Canvas camera={{ position: [0, 0, 7] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={100} color="white" />
            <AnimatedShape position={[-2, 1, 0]} scale={1.2} />
            <AnimatedShape position={[2.5, -1.5, -1]} scale={0.8} />
            <AnimatedShape position={[3, 2.5, -2.5]} scale={0.5} />
        </Canvas>
    );
}


// The main page component
export default function SignupPage() {
    const { signup, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create an account. The email may already be in use.');
        }
    };
    
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in with Google.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row items-stretch justify-center overflow-hidden">
            
            {/* Left Side: Title and 3D Background */}
            <div className="w-full md:w-1/2 h-1/2 md:h-screen relative">
                <div className="absolute inset-0 z-0">
                    <Scene3D />
                </div>
                <div className="w-full h-full flex items-center justify-center p-12 z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-center">
                        Get started on your journey.
                    </h1>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="bg-transparent w-full max-w-md z-10">
                    <h2 className="text-3xl font-bold text-center mb-6">Create Your Quorith Account</h2>
                    
                    {error && (
                        <p className="border border-red-500 text-red-400 text-center p-3 rounded mb-4">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2">Password (6+ characters)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300">
                            Sign Up
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black text-gray-400">OR</span>
                        </div>
                    </div>

                     <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition duration-300">
                        <svg className="w-5 h-5" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.8 110.1 20 244 20c65.5 0 124 23.4 168.9 60.9l-67.9 67.9C298.3 118.8 273.1 108 244 108c-73.2 0-132.3 59.4-132.3 132.9s59.1 132.9 132.3 132.9c76.9 0 115.3-53.1 120-80.4H244V261.8h244z"></path></svg>
                        Sign Up with Google
                    </button>

                    <p className="text-center mt-6 text-gray-400">
                        Already have an account? <Link to="/login" className="text-gray-200 hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}