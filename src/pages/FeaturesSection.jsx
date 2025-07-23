
// import React from 'react';
// import { motion } from 'framer-motion';

// const featuresData = [
//     { title: "AI-Driven Daily Goals", description: "Receive smart, daily goal suggestions based on your long-term plans and ambitions.", icon: "🎯" },
//     { title: "Comprehensive Planning", description: "Structure your ambitions with daily, weekly, monthly, and yearly plans.", icon: "📅" },
//     { title: "To-Do & Habit Tracker", description: "Build consistency with custom tasks, recurring habits, and streak tracking.", icon: "✅" },
//     { title: "Reflection Journal", description: "Gain insights with end-of-day prompts and AI-powered pattern summaries.", icon: "✍️" },
//     { title: "Analytics Dashboard", description: "Visualize your progress and consistency with beautiful charts and reports.", icon: "📊" },
//     { title: "Distraction-Free UI", description: "A minimal, aesthetic interface with dark/light modes and a focus timer.", icon: "🧘" },
// ];

// const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.2,
//         },
//     },
// };

// const itemVariants = {
//     hidden: { y: 30, opacity: 0 },
//     visible: {
//         y: 0,
//         opacity: 1,
//         transition: {
//             duration: 0.8,
//             ease: 'easeOut',
//         },
//     },
// };

// const featureCardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
//     hover: {
//         scale: 1.04,
//         rotate: 0.5,
//         boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.15)",
//         transition: { duration: 0.3, ease: 'easeOut' },
//     },
// };

// const FeaturesSection = () => {
//     return (
//         <motion.section
//             className="py-20 md:py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//         >
//             <div className="max-w-6xl mx-auto">
//                 <motion.h2
//                     className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
//                     variants={itemVariants}
//                 >
//                     Core Features
//                 </motion.h2>
//                 <motion.p
//                     className="text-center text-gray-400 max-w-xl mx-auto mb-16"
//                     variants={itemVariants}
//                 >
//                     Explore how Synthara helps you systematically level up your life with structured, AI-assisted mastery.
//                 </motion.p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {featuresData.map((feature, index) => (
//                         <motion.div
//                             key={index}
//                             className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition duration-300 ease-in-out"
//                             variants={featureCardVariants}
//                             initial="hidden"
//                             whileInView="visible"
//                             whileHover="hover"
//                             viewport={{ once: true, amount: 0.4 }}
//                         >
//                             <div className="text-4xl mb-4 transition-transform duration-300 ease-in-out group-hover:rotate-3">
//                                 {feature.icon}
//                             </div>
//                             <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">
//                                 {feature.title}
//                             </h3>
//                             <p className="text-gray-300 text-sm">
//                                 {feature.description}
//                             </p>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </motion.section>
//     );
// };

// export default FeaturesSection;


// "use client"

// import { useRef } from "react"
// import { motion } from "framer-motion"
// import { Canvas, useFrame } from "@react-three/fiber"
// import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
// import { Target, CalendarDays, ListTodo, BookOpen, BarChart, EyeOff } from "lucide-react"

// // Three.js Background Component
// function ThreeDBackground() {
//   const meshRef1 = useRef()
//   const meshRef2 = useRef()
//   const meshRef3 = useRef()

//   useFrame(() => {
//     if (meshRef1.current) {
//       meshRef1.current.rotation.x += 0.001
//       meshRef1.current.rotation.y += 0.001
//     }
//     if (meshRef2.current) {
//       meshRef2.current.rotation.x -= 0.0015
//       meshRef2.current.rotation.y -= 0.0015
//     }
//     if (meshRef3.current) {
//       meshRef3.current.rotation.x += 0.0008
//       meshRef3.current.rotation.y += 0.0008
//     }
//   })

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} intensity={1} />
//       <pointLight position={[-10, -10, -10]} intensity={0.8} />

//       {/* White spheres for a professional look */}
//       <Sphere args={[1, 32, 32]} position={[3, 2, -5]} ref={meshRef1}>
//         <MeshDistortMaterial
//           color="#ffffff" // Changed to white
//           attach="material"
//           distort={0.5}
//           speed={2}
//           roughness={0.5}
//           metalness={0.8}
//         />
//       </Sphere>
//       <Sphere args={[0.8, 32, 32]} position={[-4, -3, -7]} ref={meshRef2}>
//         <MeshDistortMaterial
//           color="#ffffff" // Changed to white
//           attach="material"
//           distort={0.6}
//           speed={2.5}
//           roughness={0.6}
//           metalness={0.7}
//         />
//       </Sphere>
//       <Sphere args={[1.2, 32, 32]} position={[0, 5, -10]} ref={meshRef3}>
//         <MeshDistortMaterial
//           color="#ffffff" // Changed to white
//           attach="material"
//           distort={0.4}
//           speed={1.8}
//           roughness={0.7}
//           metalness={0.9}
//         />
//       </Sphere>
//       <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
//     </>
//   )
// }

// const featuresData = [
//   {
//     title: "AI-Driven Daily Goals",
//     description: "Receive smart, daily goal suggestions based on your long-term plans and ambitions.",
//     icon: Target,
//   },
//   {
//     title: "Comprehensive Planning",
//     description: "Structure your ambitions with daily, weekly, monthly, and yearly plans.",
//     icon: CalendarDays,
//   },
//   {
//     title: "To-Do & Habit Tracker",
//     description: "Build consistency with custom tasks, recurring habits, and streak tracking.",
//     icon: ListTodo,
//   },
//   {
//     title: "Reflection Journal",
//     description: "Gain insights with end-of-day prompts and AI-powered pattern summaries.",
//     icon: BookOpen,
//   },
//   {
//     title: "Analytics Dashboard",
//     description: "Visualize your progress and consistency with beautiful charts and reports.",
//     icon: BarChart,
//   },
//   {
//     title: "Distraction-Free UI",
//     description: "A minimal, aesthetic interface with dark/light modes and a focus timer.",
//     icon: EyeOff,
//   },
// ]

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//     },
//   },
// }

// const itemVariants = {
//   hidden: { y: 30, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.8,
//       ease: "easeOut",
//     },
//   },
// }

// const featureCardVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   hover: {
//     scale: 1.03,
//     boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
//     transition: { duration: 0.2, ease: "easeOut" }, // Optimized transition duration
//   },
// }

// const iconVariants = {
//   hover: {
//     rotate: 3, // Apply rotation directly via Framer Motion
//     scale: 1.1,
//     transition: { duration: 0.2, ease: "easeOut" },
//   },
// }

// const FeaturesSection = () => {
//   return (
//     <motion.section
//       className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.1 }}
//       variants={containerVariants}
//     >
//       {/* Three.js Canvas as background */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
//           <ThreeDBackground />
//         </Canvas>
//       </div>

//       <div className="max-w-6xl mx-auto relative z-10">
//         <motion.h2
//           className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
//           variants={itemVariants}
//         >
//           Core Features
//         </motion.h2>
//         <motion.p className="text-center text-gray-400 max-w-xl mx-auto mb-16" variants={itemVariants}>
//           Explore how Synthara helps you systematically level up your life with structured, AI-assisted mastery.
//         </motion.p>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featuresData.map((feature, index) => (
//             <motion.div
//               key={index}
//               className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 group" // Removed CSS transition
//               variants={featureCardVariants}
//               initial="hidden"
//               whileInView="visible"
//               whileHover="hover"
//               viewport={{ once: true, amount: 0.4 }}
//             >
//               {/* Subtle white glow border on hover */}
//               <div className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//                 <div className="absolute inset-0 rounded-2xl bg-white/20" /> {/* Removed blur-md */}
//               </div>

//               <div className="relative z-10">
//                 {/* Lucide Icon rendering with Framer Motion hover */}
//                 <motion.div
//                   className="text-white text-4xl mb-4"
//                   variants={iconVariants}
//                   whileHover="hover" // Apply hover variant to the icon container
//                 >
//                   <feature.icon className="w-10 h-10" />
//                 </motion.div>
//                 <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">{feature.title}</h3>
//                 <p className="text-gray-300 text-sm">{feature.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </motion.section>
//   )
// }

// export default FeaturesSection


// Improvements made:
// - Added subtle gradient border and hover lift for cards
// - Used glassmorphism with layered backdrop blur and border
// - Improved typography hierarchy and color
// - Added slight icon rotation on hover for interactivity
// - Added smooth transition for dark/light adaptability
// - Included motion.div fade-in for header and subtitle
// ENHANCEMENT: Integrated a floating 3D neural network background with Three.js
// Improvements made:
// - Integrated a floating 3D neural network background
// - Replaced emojis with lucide-react icons for professional look
// - Used glassmorphism with layered backdrop blur and border
// - Improved typography hierarchy and color
// - Added icon rotation on hover for interactivity
// - Included Framer Motion animations for a dynamic feel

import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
    Target,
    CalendarDays,
    CheckSquare,
    BookOpen,
    BarChart3,
    ZapOff,
} from 'lucide-react';


// --- Data and Animation Variants ---

// UPDATED: featuresData now uses lucide-react components for icons
const featuresData = [
    { title: "AI-Driven Daily Goals", description: "Receive smart, daily goal suggestions based on your long-term plans and ambitions.", icon: <Target className="w-10 h-10 text-white/90" /> },
    { title: "Comprehensive Planning", description: "Structure your ambitions with daily, weekly, monthly, and yearly plans.", icon: <CalendarDays className="w-10 h-10 text-white/90" /> },
    { title: "To-Do & Habit Tracker", description: "Build consistency with custom tasks, recurring habits, and streak tracking.", icon: <CheckSquare className="w-10 h-10 text-white/90" /> },
    { title: "Reflection Journal", description: "Gain insights with end-of-day prompts and AI-powered pattern summaries.", icon: <BookOpen className="w-10 h-10 text-white/90" /> },
    { title: "Analytics Dashboard", description: "Visualize your progress and consistency with beautiful charts and reports.", icon: <BarChart3 className="w-10 h-10 text-white/90" /> },
    { title: "Distraction-Free UI", description: "A minimal, aesthetic interface with dark/light modes and a focus timer.", icon: <ZapOff className="w-10 h-10 text-white/90" /> },
];


const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    hover: {
        scale: 1.04,
        rotate: 0.5,
        boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

// --- 3D Neural Network Component (Unchanged) ---
const NeuralNetwork = () => {
    const groupRef = useRef();

    const { nodes, lines } = useMemo(() => {
        const numNodes = 150;
        const nodePositions = new Float32Array(numNodes * 3);
        const nodesData = [];

        for (let i = 0; i < numNodes; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            nodePositions.set([x, y, z], i * 3);
            nodesData.push({ position: new THREE.Vector3(x, y, z) });
        }

        const linePositions = [];
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (nodesData[i].position.distanceTo(nodesData[j].position) < 1.5) {
                    linePositions.push(...nodesData[i].position.toArray(), ...nodesData[j].position.toArray());
                }
            }
        }
        return { nodes: nodePositions, lines: new Float32Array(linePositions) };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
            groupRef.current.rotation.x += delta * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={nodes.length / 3} array={nodes} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#888888" size={0.05} sizeAttenuation />
            </points>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#2a2a2a" transparent opacity={0.5} />
            </lineSegments>
        </group>
    );
};

// --- Main Enhanced Features Section ---
const FeaturesSection = () => {
    return (
        <motion.section
            className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            {/* 3D Canvas Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <NeuralNetwork />
                </Canvas>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.h2
                    className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                    variants={itemVariants}
                >
                    Core Features
                </motion.h2>
                <motion.p
                    className="text-center text-gray-400 max-w-xl mx-auto mb-16"
                    variants={itemVariants}
                >
                    Explore how Synthara helps you systematically level up your life with structured, AI-assisted mastery.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group relative p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition duration-300 ease-in-out"
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.4 }}
                        >
                            {/* UPDATED: Icon rendering */}
                            <div className="mb-4 transition-transform duration-300 ease-in-out group-hover:rotate-[-5deg]">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default FeaturesSection;