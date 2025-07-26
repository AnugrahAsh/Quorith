const AboutSection = () => {
    return (
        <motion.section 
            className="py-20 md:py-32 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <div className="max-w-4xl mx-auto text-center">
                <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={itemVariants}>
                    Master Yourself, Master Your Life
                </motion.h2>
                <motion.p className="text-lg md:text-xl text-gray-300 leading-relaxed" variants={itemVariants}>
                    Quorith is a full-stack self-improvement and personal mastery web application designed to help you achieve your full potential. It combines a powerful Plansning system with an AI coach to provide structure, accountability, and tailored suggestions, all within a clean, calming UI designed to reduce cognitive clutter.
                </motion.p>
            </div>
        </motion.section>
    );
};

export default AboutSection;
import { motion } from 'framer-motion';


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
