import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// Main App Component
const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsMounted(true);
    controls.start("visible");
  }, [controls]);

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  const buttonVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1,
        duration: 0.5,
        ease: 'backOut'
      }
    }
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white overflow-hidden">
      {isMounted && <ThreeScene />}
      <header className="absolute top-0 right-0 p-4 md:p-10 z-30">
        <motion.div 
          className="relative group"
          variants={buttonVariants}
          initial="hidden"
          animate={controls}
        >
          <button className="bg-white text-black font-bold py-3 px-6 rounded-md relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]">
            <a href="#">Get Started</a>
          </button>
          <div className="absolute top-0 left-0 w-full h-full border-2 border-white rounded-md transition-transform duration-300 ease-in-out group-hover:translate-x-[4px] group-hover:translate-y-[4px]"></div>
        </motion.div>
      </header>

      <div className="relative z-10 flex items-center justify-center h-screen">
        <motion.div 
          className="text-center"
          variants={textContainerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-light text-gray-300"
            variants={textVariants}
          >
            Welcome To
          </motion.h2>
          <motion.h1 
            className="text-8xl md:text-[200px] lg:text-[240px] font-black text-white"
            variants={textVariants}
          >
            Synthara
          </motion.h1>
        </motion.div>
      </div>
    </div>
  );
};

// Three.js Scene Component
const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Torus Knot Geometry - Increased size from 1.5 to 2.5
        const geometry = new THREE.TorusKnotGeometry(2.5, 0.3, 200, 20);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.9, 
            roughness: 0.1,
            wireframe: true,
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Mouse interaction
        const mouse = new THREE.Vector2();
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            torusKnot.rotation.x += 0.001;
            torusKnot.rotation.y += 0.002;

            // Subtle camera movement based on mouse position
            camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
            camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default HeroSection;
