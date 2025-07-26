import React, { useState, useEffect, useRef } from 'react';
// Make sure to install these dependencies:
// npm install three framer-motion lucide-react
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Using your original AuthContext import
import { Target } from 'lucide-react';

// --- 3D Background Component ---
// This component creates the floating cube animation.
const ThreeCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: currentMount,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });

        const cubes = [];
        const cubeCount = 40;
        for (let i = 0; i < cubeCount; i++) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
            cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            const scale = Math.random() * 0.4 + 0.2;
            cube.scale.set(scale, scale, scale);
            
            cube.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005);
            cube.userData.rotationSpeed = new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01);
            
            cubes.push(cube);
            scene.add(cube);
        }

        camera.position.z = 10;

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            cubes.forEach(cube => {
                cube.rotation.x += cube.userData.rotationSpeed.x;
                cube.rotation.y += cube.userData.rotationSpeed.y;
                cube.position.add(cube.userData.velocity);

                if (cube.position.y > 12 || cube.position.y < -12) cube.userData.velocity.y *= -1;
                if (cube.position.x > 12 || cube.position.x < -12) cube.userData.velocity.x *= -1;
            });
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
        };
    }, []);

    return <canvas ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};


// --- Main Login Page Component ---
// This combines your original logic with the new design.
export default function LoginPage() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error("Login Error:", err);
        }
    };

    const handleGoogleLogin = async () => {
        setError(''); // Clear previous errors
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in with Google.');
            console.error("Google Login Error:", err);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-black text-white font-sans">
            {/* Left Side: Welcome Text & 3D Background */}
            <div className="relative w-full lg:w-1/2 h-80 lg:h-screen flex items-center justify-center p-8 order-2 lg:order-1">
                <ThreeCanvas />
                <motion.div 
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="bg-white p-2 rounded-lg">
                           <Target className="text-black" size={32} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Quorith</h1>
                    </div>
                    <p className="mt-2 text-lg text-neutral-400">Your personal OS for achieving goals.</p>
                </motion.div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8 lg:p-12 relative z-10 order-1 lg:order-2">
                <motion.div 
                    className="w-full max-w-md space-y-8"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="text-center">
                        <h2 className="text-4xl font-bold">Log In</h2>
                        <p className="mt-2 text-neutral-400">
                            Need an account? <Link to="/signup" className="font-medium text-white hover:underline">Sign Up</Link>
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                            <input
                                type="email" id="email" name="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="mt-1 block w-full bg-transparent border-2 border-neutral-700 rounded-md p-3 text-white transition duration-300 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
                            <input
                                type="password" id="password" name="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 block w-full bg-transparent border-2 border-neutral-700 rounded-md p-3 text-white transition duration-300 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>
                        <motion.div variants={itemVariants}>
                            <motion.button 
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-white transition duration-300"
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Log In
                            </motion.button>
                        </motion.div>
                    </motion.form>

                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black text-neutral-400">OR</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.button 
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center py-3 px-4 border-2 border-neutral-700 rounded-md shadow-sm text-sm font-bold text-white bg-black transition duration-300"
                            whileHover={{ scale: 1.02, backgroundColor: '#111', borderColor: '#555', transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.8 110.1 20 244 20c65.5 0 124 23.4 168.9 60.9l-67.9 67.9C298.3 118.8 273.1 108 244 108c-73.2 0-132.3 59.4-132.3 132.9s59.1 132.9 132.3 132.9c76.9 0 115.3-53.1 120-80.4H244V261.8h244z"></path></svg>
                            Continue with Google
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
