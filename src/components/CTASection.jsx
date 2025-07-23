import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Main App component to render the CTA Section
export default function App() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <CTASection />
    </div>
  );
}

// Animation variants for the text content
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // A more expressive ease
    },
  },
};

// The main CTA Section component
const CTASection = () => {
    return (
        <section className="py-20 sm:py-24 px-4 w-full">
            {/* Main container with new white background and border */}
            <div className="relative max-w-5xl mx-auto text-center p-12 rounded-3xl border border-gray-200 overflow-hidden bg-white shadow-xl">
                {/* Background Orb Component */}
                <div className="absolute inset-0 z-0">
                    <PulsingOrb />
                </div>
                
                {/* Content container */}
                <motion.div 
                    className="relative z-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={sectionVariants}
                >
                    {/* Title with black text */}
                    <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-black" variants={itemVariants}>
                        Start Your Journey Today
                    </motion.h2>

                    {/* Subtitle with dark gray text */}
                    <motion.p className="text-lg text-gray-700 max-w-xl mx-auto mb-10" variants={itemVariants}>
                        Unlock your potential and build the life you've always envisioned. Get started for free.
                    </motion.p>

                    {/* Button with new black background and white text */}
                    <motion.button
                        className="bg-black text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started Now
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

// --- Pulsing Orb for CTA ---
// This component has been updated with a new greyish-blue color scheme.
const PulsingOrb = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        let animationFrameId;

        // --- Scene, Camera, and Renderer Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
        camera.position.z = 3.5;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(600, 600); // Made canvas slightly larger
        currentMount.appendChild(renderer.domElement);

        // --- Mouse and Interaction Tracking ---
        const mouse = new THREE.Vector2(0, 0);
        const targetRotation = new THREE.Vector2(0, 0);
        const velocity = new THREE.Vector2(0, 0);
        
        const handleMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            targetRotation.x = mouse.y * 0.5;
            targetRotation.y = mouse.x * 0.5;
        };
        
        const handleMouseDown = () => {
            material.uniforms.uClick.value = 1.0;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);

        // --- Orb Geometry and Updated Shader Material ---
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32); 
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                uMouse: { value: mouse },
                uClick: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(600, 600) },
            },
            vertexShader: `
                uniform float time;
                uniform vec2 uMouse;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;

                    float warpFactor = distance(position.xy, uMouse) * 0.5;
                    float warp = sin(time + warpFactor) * 0.1;
                    
                    vec3 newPosition = position + normal * warp;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float uClick;
                varying vec3 vPosition;
                varying vec3 vNormal;

                // Updated function to create greyish-blue tones
                vec3 coolColor(float phase) {
                    float grey = 0.5 + 0.5 * sin(phase);
                    return vec3(grey * 0.6, grey * 0.8, grey * 1.0); // Tints the grey towards blue
                }

                void main() {
                    // Base color from the new function
                    float phase = time * 0.5 + length(vPosition) * 2.0;
                    vec3 color = coolColor(phase);

                    // Fresnel effect for edge highlighting
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = 1.0 - dot(normalize(vNormal), viewDirection);
                    fresnel = pow(fresnel, 2.0);
                    // Give the fresnel a complementary light blue tint
                    color += fresnel * vec3(0.5, 0.7, 1.0) * 0.4;

                    // Click shockwave effect - now a bright white flash
                    float shockwave = smoothstep(0.0, 1.0, uClick) * 0.8;
                    color += shockwave * vec3(1.5, 1.5, 1.5);

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        });
        const orb = new THREE.Mesh(geometry, material);
        scene.add(orb);

        // --- Animation Loop with Physics ---
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            material.uniforms.time.value = elapsedTime;

            if (material.uniforms.uClick.value > 0) {
                material.uniforms.uClick.value -= 0.05; 
            }

            velocity.x += (targetRotation.x - orb.rotation.x) * 0.02;
            velocity.y += (targetRotation.y - orb.rotation.y) * 0.02;
            velocity.multiplyScalar(0.9); 
            
            orb.rotation.x += velocity.x;
            orb.rotation.y += velocity.y;
            
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        
        // --- Cleanup Function ---
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (currentMount && renderer.domElement.parentNode === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 flex items-center justify-center opacity-50" />;
};
