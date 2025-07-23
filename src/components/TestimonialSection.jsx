import { motion} from 'framer-motion';

// --- Re-usable Animation Variants ---
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


// --- 1. Redesigned Testimonials Section (Marquee) ---
const testimonialsData = [
  {
    name: "Alex Morgan",
    role: "Software Engineer",
    quote: "Quorith completely changed how I approach my personal projects. The AI goals keep me focused, and I'm more consistent than ever before.",
    image: "https://placehold.co/100x100/1F2937/FFFFFF?text=A",
  },
  {
    name: "Jessica Chen",
    role: "UX Designer",
    quote: "Finally, a productivity app that's actually calming to use. The UI is beautiful, and the reflection journal has become an essential part of my day.",
    image: "https://placehold.co/100x100/1F2937/FFFFFF?text=J",
  },
  {
    name: "David Rodriguez",
    role: "Student",
    quote: "As a student juggling multiple subjects, Quorith helped me structure my learning goals and stay consistent. I feel so much more organized.",
    image: "https://placehold.co/100x100/1F2937/FFFFFF?text=D",
  },
  {
    name: "Sarah Kim",
    role: "Freelancer",
    quote: "The analytics dashboard is a game-changer. Seeing my progress visualized keeps me motivated to push forward every week.",
    image: "https://placehold.co/100x100/1F2937/FFFFFF?text=S",
  },
   {
    name: "Michael Lee",
    role: "Entrepreneur",
    quote: "Quorith is the 'second brain' I've been looking for. It's streamlined, powerful, and keeps all my ambitions in one place.",
    image: "https://placehold.co/100x100/1F2937/FFFFFF?text=M",
  },
];

const TestimonialCard = ({ name, role, quote, image }) => {
    return (
        <figure className="relative w-80 max-w-xs flex-shrink-0 rounded-2xl border border-white/10 bg-gray-900/50 p-8 shadow-md">
            <blockquote className="text-lg text-gray-300">
                <p>“{quote}”</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
                <img className="h-14 w-14 rounded-full object-cover" src={image} alt={name} />
                <div>
                    <div className="font-bold text-white">{name}</div>
                    <div className="text-sm text-gray-400">{role}</div>
                </div>
            </figcaption>
        </figure>
    );
};


const TestimonialsSection = () => {
    const marqueeVariants = {
        animate: {
            x: [0, -1880], // (Card width + gap) * number of cards = (320 + 32) * 5 = 1760. A bit more for seamlessness.
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <motion.section 
            className="py-24 sm:py-32 overflow-hidden"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            <div className="max-w-7xl mx-auto px-4">
                <motion.div className="text-center mb-16" variants={itemVariants}>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        Trusted by Innovators
                    </h2>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                        Discover why high-achievers choose Quorith to orchestrate their success.
                    </p>
                </motion.div>
            </div>
            
            <motion.div 
                className="w-full overflow-hidden"
                whileHover={{'animationPlayState': 'paused'}}
            >
                <motion.div
                    className="flex gap-8"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </motion.div>
            </motion.div>
        </motion.section>
    );
};

export default TestimonialsSection;