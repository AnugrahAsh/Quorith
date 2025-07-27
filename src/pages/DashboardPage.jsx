// import React, { useState, useEffect, useRef } from 'react';
// // Ensure you have these dependencies in your project:
// // npm install framer-motion lucide-react firebase
// import { motion, AnimatePresence, useDragControls } from 'framer-motion';
// import {
//     Target, Repeat, CheckSquare, Library, BookOpen, LogOut, ChevronsLeft,
//     ChevronsRight, Plus, Sun, Moon, Trash2, RefreshCw, BellRing
// } from 'lucide-react';

// // --- Firebase Integration ---
// // Using the configuration from your project files.
// import { initializeApp } from 'firebase/app';
// import {
//     getAuth, onAuthStateChanged
// } from 'firebase/auth';
// import {
//     getFirestore, doc, addDoc, collection,
//     onSnapshot, deleteDoc, updateDoc, query, getDocs
// } from 'firebase/firestore';

// // Your actual Firebase config from src/firebase/config.js
// const firebaseConfig = {
//     apiKey: "AIzaSyBuO5owWE88vsxKDzNchsf4v4KiYXvWgMU",
//     authDomain: "quorith-78c19.firebaseapp.com",
//     projectId: "quorith-78c19",
//     storageBucket: "quorith-78c19.firebasestorage.app",
//     messagingSenderId: "913548830286",
//     appId: "1:913548830286:web:deedfd46b30eb2d2c0851f",
//     measurementId: "G-BJ60F0YTKQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Gemini API Key
// const GEMINI_API_KEY = "AIzaSyBoPo3gbqznM2DOU3fJ53u-_hS5bqRmKLk";


// // --- Helper Components ---
// const Modal = ({ children, isOpen, onClose }) => (
//     <AnimatePresence>
//         {isOpen && (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//                 onClick={onClose}
//             >
//                 <motion.div
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.9, opacity: 0 }}
//                     className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md p-6"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     {children}
//                 </motion.div>
//             </motion.div>
//         )}
//     </AnimatePresence>
// );

// // --- Feature View Components ---

// // 1. Plan View with Gemini and Interactive Canvas
// const PlanView = ({ userId }) => {
//     const [plans, setPlans] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [goal, setGoal] = useState('');
//     const [duration, setDuration] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isRecreating, setIsRecreating] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedPlan, setSelectedPlan] = useState(null);

//     const canvasRef = useRef(null);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const dragControls = useDragControls();

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/plans`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const plansData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//             setPlans(plansData);
//         }, (err) => console.error("Firestore error in PlanView:", err));
//         return () => unsubscribe();
//     }, [userId]);

//     const generatePlanFromAPI = async (currentGoal, currentDuration) => {
//         const prompt = `Create a highly detailed and actionable roadmap to achieve the goal: "${currentGoal}" within ${currentDuration}. Break it down into logical milestones. For each milestone, provide a title, a duration, and a list of specific tasks. Each task must have a 'name' and an 'effort' level (e.g., "Low", "Medium", "High").`;
//         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

//         const payload = {
//             contents: [{ parts: [{ text: prompt }] }],
//             generationConfig: {
//                 response_mime_type: "application/json",
//                 response_schema: {
//                     type: "OBJECT",
//                     properties: {
//                         roadmap: {
//                             type: "ARRAY",
//                             items: {
//                                 type: "OBJECT",
//                                 properties: {
//                                     title: { type: "STRING" },
//                                     duration: { type: "STRING" },
//                                     tasks: {
//                                         type: "ARRAY",
//                                         items: {
//                                             type: "OBJECT",
//                                             properties: {
//                                                 name: { type: "STRING" },
//                                                 effort: { type: "STRING" },
//                                                 completed: { type: "BOOLEAN", default: false }
//                                             },
//                                             required: ["name", "effort", "completed"]
//                                         }
//                                     }
//                                 },
//                                 required: ["title", "duration", "tasks"]
//                             }
//                         }
//                     },
//                     required: ["roadmap"]
//                 }
//             }
//         };

//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });

//         if (!response.ok) {
//             const errorBody = await response.json();
//             throw new Error(`API Error: ${errorBody.error.message}`);
//         }

//         const data = await response.json();
//         const roadmapText = data.candidates[0].content.parts[0].text;
//         return JSON.parse(roadmapText);
//     };

//     const handleCreatePlan = async (e) => {
//         e.preventDefault();
//         if (!goal || !duration) {
//             setError('Please fill out all fields.');
//             return;
//         }
//         setIsLoading(true);
//         setError('');

//         try {
//             const roadmapData = await generatePlanFromAPI(goal, duration);
//             await addDoc(collection(db, `users/${userId}/plans`), {
//                 goal,
//                 duration,
//                 roadmap: roadmapData.roadmap,
//                 createdAt: new Date(),
//             });
//             setIsModalOpen(false);
//             setGoal('');
//             setDuration('');
//         } catch (apiError) {
//             setError(`Failed to generate plan: ${apiError.message}`);
//             console.error(apiError);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleRecreatePlan = async () => {
//         if (!selectedPlan) return;
//         setIsRecreating(true);
//         setError('');
//         try {
//             const newRoadmapData = await generatePlanFromAPI(selectedPlan.goal, selectedPlan.duration);
//             const planRef = doc(db, `users/${userId}/plans`, selectedPlan.id);
//             await updateDoc(planRef, {
//                 roadmap: newRoadmapData.roadmap
//             });
//             // Update the selected plan in state to reflect the changes immediately
//             setSelectedPlan(prev => ({...prev, roadmap: newRoadmapData.roadmap}));
//         } catch (apiError) {
//              setError(`Failed to recreate plan: ${apiError.message}`);
//              console.error(apiError);
//         } finally {
//             setIsRecreating(false);
//         }
//     };
    
//     const deletePlan = async (e, planId) => {
//         e.stopPropagation();
//         if (window.confirm("Are you sure you want to delete this plan?")) {
//             await deleteDoc(doc(db, `users/${userId}/plans`, planId));
//             if(selectedPlan && selectedPlan.id === planId) {
//                 setSelectedPlan(null);
//             }
//         }
//     }

//     const effortColor = {
//         "Low": "bg-green-500",
//         "Medium": "bg-yellow-500",
//         "High": "bg-red-500",
//     };

//     const renderRoadmap = (roadmap) => (
//          <div className="flex items-start space-x-4 p-8 md:p-16 min-w-max">
//             {roadmap.map((milestone, mIndex) => (
//                 <React.Fragment key={mIndex}>
//                     <div className="flex flex-col items-center w-80">
//                         <div className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg shadow-md w-full text-center">
//                             <h3 className="font-bold text-lg text-black dark:text-white">{milestone.title}</h3>
//                             <p className="text-sm text-neutral-600 dark:text-neutral-400">{milestone.duration}</p>
//                         </div>
//                         <div className="h-8 w-1 bg-neutral-300 dark:bg-neutral-700"></div>
//                         <div className="flex flex-col space-y-3 w-full">
//                             {milestone.tasks.map((task, tIndex) => (
//                                 <div key={tIndex} className="bg-white dark:bg-black p-3 rounded-md shadow-sm w-full">
//                                     <div className="flex justify-between items-center">
//                                         <p className="text-sm text-black dark:text-white flex-1 pr-2">{task.name}</p>
//                                         <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${effortColor[task.effort] || 'bg-gray-400'}`}>{task.effort}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                      {mIndex < roadmap.length - 1 && <div className="h-1 w-16 bg-neutral-300 dark:bg-neutral-700 self-start mt-8"></div>}
//                 </React.Fragment>
//             ))}
//         </div>
//     );

//     return (
//         <div>
//              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
//                 <h1 className="text-4xl font-bold">My Plans</h1>
//                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105 self-start md:self-center">
//                     <Plus size={20} /> New Plan
//                 </button>
//             </div>
            
//             {selectedPlan ? (
//                 <div>
//                     <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//                         <button onClick={() => setSelectedPlan(null)} className="text-sm font-semibold">&larr; Back to all plans</button>
//                         <h2 className="text-2xl font-bold text-center flex-grow">{selectedPlan.goal}</h2>
//                         <button onClick={handleRecreatePlan} disabled={isRecreating} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50">
//                             <RefreshCw size={14} className={isRecreating ? 'animate-spin' : ''} /> {isRecreating ? 'Recreating...' : 'Recreate Plan'}
//                         </button>
//                     </div>
//                     {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//                     <div ref={canvasRef} className="w-full h-[60vh] bg-neutral-100 dark:bg-black rounded-lg overflow-hidden cursor-grab active:cursor-grabbing relative" onPointerDown={(e) => dragControls.start(e)}>
//                         <motion.div
//                             className="absolute top-0 left-0"
//                             style={{ x: position.x, y: position.y, scale: zoom, transformOrigin: 'top left' }}
//                             drag
//                             dragControls={dragControls}
//                             dragConstraints={canvasRef}
//                             dragListener={false}
//                             onUpdate={({x, y}) => setPosition({x, y})}
//                         >
//                            {renderRoadmap(selectedPlan.roadmap)}
//                         </motion.div>
//                     </div>
//                     <div className="flex items-center justify-center gap-2 mt-4">
//                         <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 rounded-md bg-neutral-200 dark:bg-neutral-800">-</button>
//                         <span className="text-sm w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
//                         <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 rounded-md bg-neutral-200 dark:bg-neutral-800">+</button>
//                     </div>
//                 </div>
//             ) : (
//                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {plans.map(plan => (
//                         <div key={plan.id} className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative group" onClick={() => setSelectedPlan(plan)}>
//                              <button onClick={(e) => deletePlan(e, plan.id)} className="absolute top-2 right-2 p-1 rounded-full bg-white/10 text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-opacity"><Trash2 size={16}/></button>
//                             <h3 className="font-bold text-xl mb-2">{plan.goal}</h3>
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400">Duration: {plan.duration}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Create a New Plan</h2>
//                 {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded-md">{error}</p>}
//                 <form onSubmit={handleCreatePlan}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">The Goal</label>
//                         <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., Launch a new SaaS product" />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duration</label>
//                         <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., 3 months" />
//                     </div>
//                     <button type="submit" disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
//                         {isLoading ? 'Generating...' : 'Create Plan'}
//                     </button>
//                 </form>
//             </Modal>
//         </div>
//     );
// };


// // 2. Habit Tracker
// const HabitsView = ({ userId }) => {
//     const [habits, setHabits] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [habitName, setHabitName] = useState('');
//     const [days, setDays] = useState([]);
//     const [reminderTime, setReminderTime] = useState('');
//     const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

//     const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/habits`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             setHabits(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
//         });
//         return () => unsubscribe();
//     }, [userId]);
    
//     useEffect(() => {
//         if (notificationPermission !== 'granted') return;

//         const interval = setInterval(() => {
//             const now = new Date();
//             const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
//             const currentDay = weekDays[dayIndex];
//             const currentTime = now.toTimeString().slice(0, 5);
            
//             habits.forEach(habit => {
//                 if (habit.reminderTime === currentTime && habit.days.includes(currentDay)) {
//                     new Notification('Quorith Habit Reminder', {
//                         body: `It's time for: "${habit.name}"`,
//                         icon: '/logo.png' // Make sure you have a logo.png in your public folder
//                     });
//                 }
//             });
//         }, 60000); 
//         return () => clearInterval(interval);
//     }, [habits, notificationPermission, weekDays]);

//     const requestNotificationPermission = () => {
//         Notification.requestPermission().then(permission => {
//             setNotificationPermission(permission);
//         });
//     };

//     const handleDayToggle = (day) => {
//         setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
//     };

//     const handleAddHabit = async (e) => {
//         e.preventDefault();
//         if (!habitName || days.length === 0) return;
//         await addDoc(collection(db, `users/${userId}/habits`), {
//             name: habitName,
//             days,
//             reminderTime,
//             createdAt: new Date(),
//         });
//         setIsModalOpen(false);
//         setHabitName('');
//         setDays([]);
//         setReminderTime('');
//     };
    
//     const deleteHabit = async (id) => {
//         await deleteDoc(doc(db, `users/${userId}/habits`, id));
//     }

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-4xl font-bold">Habits</h1>
//                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105">
//                     <Plus size={20} /> New Habit
//                 </button>
//             </div>

//             {notificationPermission !== 'granted' && (
//                 <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg mb-6 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <BellRing size={20} />
//                         <p>Enable notifications to get reminders for your habits.</p>
//                     </div>
//                     {notificationPermission !== 'denied' && (
//                         <button onClick={requestNotificationPermission} className="font-semibold bg-yellow-400/20 px-3 py-1 rounded-md">Enable</button>
//                     )}
//                 </div>
//             )}

//             <div className="space-y-4">
//                 {habits.map(habit => (
//                     <div key={habit.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
//                         <div>
//                             <p className="font-semibold">{habit.name}</p>
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400">
//                                 {habit.days.join(', ')} {habit.reminderTime && `at ${habit.reminderTime}`}
//                             </p>
//                         </div>
//                         <button onClick={() => deleteHabit(habit.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
//                     </div>
//                 ))}
//             </div>
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                  <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Add New Habit</h2>
//                  <form onSubmit={handleAddHabit}>
//                     <input type="text" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder="e.g., Read for 30 minutes" className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 mb-4 text-black dark:text-white" />
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repeat on</label>
//                         <div className="flex flex-wrap gap-2">
//                             {weekDays.map(day => (
//                                 <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${days.includes(day) ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-200 dark:bg-neutral-800'}`}>{day.slice(0,1)}</button>
//                             ))}
//                         </div>
//                         <button type="button" onClick={() => setDays(weekDays)} className="text-sm mt-2 font-semibold text-black dark:text-white">Set to Daily</button>
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reminder Time (optional)</label>
//                         <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
//                     </div>
//                     <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Add Habit</button>
//                  </form>
//             </Modal>
//         </div>
//     );
// };

// // 3. To-Do List
// const TodosView = ({ userId }) => {
//     const [todos, setTodos] = useState([]);
//     const [aiTodos, setAiTodos] = useState([]);
//     const [task, setTask] = useState('');
//     const [priority, setPriority] = useState('medium');
//     const [isLoadingAiTasks, setIsLoadingAiTasks] = useState(true);

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/todos`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             setTodos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
//         });

//         const fetchAiTasks = async () => {
//             setIsLoadingAiTasks(true);
//             const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//             const cacheKey = `ai-todos-${userId}-${today}`;
//             const cachedData = localStorage.getItem(cacheKey);

//             if (cachedData) {
//                 setAiTodos(JSON.parse(cachedData));
//                 setIsLoadingAiTasks(false);
//                 return;
//             }

//             const plansQuery = query(collection(db, `users/${userId}/plans`));
//             const plansSnapshot = await getDocs(plansQuery);
//             if (plansSnapshot.empty) {
//                 setAiTodos([]);
//                 setIsLoadingAiTasks(false);
//                 return;
//             }
            
//             const firstPlan = plansSnapshot.docs[0].data(); 
//             const prompt = `Based on this plan: ${JSON.stringify(firstPlan.roadmap)}, what are the top 3 most important tasks for today? Respond with a simple JSON array of strings.`;
            
//             const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
//             const payload = { contents: [{ parts: [{ text: prompt }] }] };

//             try {
//                 const response = await fetch(apiUrl, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 });
//                 if (!response.ok) throw new Error("AI task generation failed");
//                 const data = await response.json();
//                 const tasksText = data.candidates[0].content.parts[0].text;
//                 const tasks = JSON.parse(tasksText.replace(/```json|```/g, ''));
//                 setAiTodos(tasks);
//                 localStorage.setItem(cacheKey, JSON.stringify(tasks));
//             } catch (error) {
//                 console.error("Failed to fetch AI tasks:", error);
//                 setAiTodos(["Could not fetch AI tasks."]);
//             } finally {
//                 setIsLoadingAiTasks(false);
//             }
//         };
//         fetchAiTasks();

//         return () => unsubscribe();
//     }, [userId]);

//     const handleAddTask = async (e) => {
//         e.preventDefault();
//         if (!task) return;
//         await addDoc(collection(db, `users/${userId}/todos`), {
//             task,
//             priority,
//             completed: false,
//             createdAt: new Date(),
//         });
//         setTask('');
//         setPriority('medium');
//     };

//     const toggleComplete = async (todo) => {
//         await updateDoc(doc(db, `users/${userId}/todos`, todo.id), { completed: !todo.completed });
//     };

//     const deleteTask = async (id) => {
//         await deleteDoc(doc(db, `users/${userId}/todos`, id));
//     };

//     const priorityColor = {
//         high: 'border-red-500',
//         medium: 'border-yellow-500',
//         low: 'border-green-500',
//     };

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">To-Do List</h1>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                     <h2 className="text-2xl font-semibold mb-4">AI Suggested Tasks</h2>
//                     <div className="space-y-3">
//                         {isLoadingAiTasks ? <p className="text-neutral-500">Generating today's tasks...</p> : 
//                          aiTodos.length > 0 ? aiTodos.map((aiTask, i) => (
//                             <div key={i} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg border-l-4 border-blue-500">
//                                 <p>{aiTask}</p>
//                             </div>
//                         )) : <p className="text-neutral-500">No AI tasks available. Create a plan first!</p>}
//                     </div>
//                 </div>
//                 <div>
//                     <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
//                     <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
//                         <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Add a new task" className="flex-grow p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
//                         <select value={priority} onChange={e => setPriority(e.target.value)} className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white">
//                             <option value="high">High</option>
//                             <option value="medium">Medium</option>
//                             <option value="low">Low</option>
//                         </select>
//                         <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-3 rounded-lg"><Plus size={20}/></button>
//                     </form>
//                     <div className="space-y-3">
//                         {todos.map(todo => (
//                             <div key={todo.id} className={`bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex items-center justify-between border-l-4 ${priorityColor[todo.priority]}`}>
//                                 <div className="flex items-center gap-3">
//                                     <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} className="h-5 w-5 rounded text-black dark:text-white focus:ring-0" />
//                                     <span className={todo.completed ? 'line-through text-neutral-500' : ''}>{todo.task}</span>
//                                 </div>
//                                 <button onClick={() => deleteTask(todo.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // 4. Library
// const LibraryView = () => {
//     const [books, setBooks] = useState([
//         {
//             id: 1,
//             title: "Atomic Habits",
//             author: "James Clear",
//             summary: "An easy & proven way to build good habits & break bad ones.",
//             chapters: [
//                 { title: "The Fundamentals", content: "Why small habits make a big difference. The surprising power of atomic habits. How your habits shape your identity (and vice versa)." },
//                 { title: "The 1st Law: Make It Obvious", content: "How to create powerful cues in your environment to trigger good habits. The best way to start a new habit. The role of location and time in habit formation." },
//                 { title: "The 2nd Law: Make It Attractive", content: "The role of dopamine in habit formation. How to use temptation bundling to make your habits more attractive. The power of joining a culture where your desired behavior is the normal behavior." },
//             ]
//         },
//         {
//             id: 2,
//             title: "Deep Work",
//             author: "Cal Newport",
//             summary: "Rules for focused success in a distracted world.",
//             chapters: [
//                 { title: "The Deep Work Hypothesis", content: "The ability to perform deep work is becoming increasingly rare at the exact same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive." },
//                 { title: "Rule #1: Work Deeply", content: "Strategies to cultivate deep work, including scheduling your time, embracing boredom, and quitting social media. The importance of rituals to start your deep work sessions." },
//             ]
//         }
//     ]);
//     const [selectedBook, setSelectedBook] = useState(null);

//     if (selectedBook) {
//         return (
//             <div>
//                 <button onClick={() => setSelectedBook(null)} className="mb-4 text-sm font-semibold">&larr; Back to library</button>
//                 <h1 className="text-4xl font-bold">{selectedBook.title}</h1>
//                 <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">{selectedBook.author}</p>
//                 <div className="space-y-6">
//                     {selectedBook.chapters.map(chapter => (
//                         <div key={chapter.title}>
//                             <h3 className="text-2xl font-semibold mb-2">{chapter.title}</h3>
//                             <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{chapter.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">Library</h1>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {books.map(book => (
//                     <div key={book.id} onClick={() => setSelectedBook(book)} className="cursor-pointer group">
//                         <div className="bg-neutral-300 dark:bg-neutral-800 h-64 rounded-lg flex items-center justify-center p-4 text-center font-bold text-black dark:text-white transition-transform group-hover:scale-105">
//                             {book.title}
//                         </div>
//                         <h3 className="font-semibold mt-2">{book.title}</h3>
//                         <p className="text-sm text-neutral-500 dark:text-neutral-400">{book.author}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // 5. Journal
// const JournalView = ({ userId }) => {
//     const [entries, setEntries] = useState([]);
//     const [newEntry, setNewEntry] = useState('');

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/journal`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const sortedEntries = snapshot.docs
//                 .map(d => ({ id: d.id, ...d.data() }))
//                 .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
//             setEntries(sortedEntries);
//         });
//         return () => unsubscribe();
//     }, [userId]);

//     const handleSaveEntry = async () => {
//         if (!newEntry) return;
//         await addDoc(collection(db, `users/${userId}/journal`), {
//             content: newEntry,
//             createdAt: new Date(),
//         });
//         setNewEntry('');
//     };

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">Journal</h1>
//             <div className="mb-8">
//                 <textarea 
//                     value={newEntry}
//                     onChange={e => setNewEntry(e.target.value)}
//                     placeholder="How did today go?"
//                     className="w-full h-40 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
//                 ></textarea>
//                 <button onClick={handleSaveEntry} className="mt-4 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Save Entry</button>
//             </div>
//             <div>
//                 <h2 className="text-2xl font-semibold mb-4">Past Entries</h2>
//                 <div className="space-y-4">
//                     {entries.map(entry => (
//                         <div key={entry.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg">
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
//                                 {entry.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                             </p>
//                             <p className="whitespace-pre-wrap">{entry.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Dashboard Page Component ---

// export default function DashboardPage() {
//     const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//     const [activeView, setActiveView] = useState('plan');
//     const [theme, setTheme] = useState(() => {
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme) return savedTheme;
//         return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//     });
//     const [currentUser, setCurrentUser] = useState(null);
//     const [authReady, setAuthReady] = useState(false);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, user => {
//             setCurrentUser(user);
//             setAuthReady(true);
//         });
//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         if (theme === 'dark') {
//             document.documentElement.classList.add('dark');
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//             localStorage.setItem('theme', 'light');
//         }
//     }, [theme]);

//     const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

//     const renderView = () => {
//         if (!authReady) return <div className="text-center p-10">Authenticating...</div>;
//         if (!currentUser) return <div className="text-center p-10">No user is signed in. Please log in to continue.</div>;

//         switch (activeView) {
//             case 'plan': return <PlanView userId={currentUser.uid} />;
//             case 'habits': return <HabitsView userId={currentUser.uid} />;
//             case 'todos': return <TodosView userId={currentUser.uid} />;
//             case 'library': return <LibraryView />;
//             case 'journal': return <JournalView userId={currentUser.uid} />;
//             default: return <PlanView userId={currentUser.uid} />;
//         }
//     };

//     const navItems = [
//         { id: 'plan', label: 'My Plan', icon: Target },
//         { id: 'habits', label: 'Habits', icon: Repeat },
//         { id: 'todos', label: 'To-Do List', icon: CheckSquare },
//         { id: 'library', label: 'Library', icon: Library },
//         { id: 'journal', label: 'Journal', icon: BookOpen },
//     ];

//     return (
//         <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white font-sans relative">
//             {/* Sidebar */}
//             <aside className={`flex flex-col justify-between bg-neutral-100 dark:bg-neutral-900 p-4 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
//                 <div>
//                     <div className="flex items-center gap-2 mb-10">
//                         <div className="bg-black dark:bg-white rounded p-1">
//                           <Target className="text-white dark:text-black" />
//                         </div>
//                         {!isSidebarCollapsed && <h1 className="text-xl font-bold">Quorith</h1>}
//                     </div>
//                     <nav className="flex flex-col gap-2">
//                         {navItems.map((item) => (
//                             <button 
//                                 key={item.id}
//                                 onClick={() => setActiveView(item.id)}
//                                 className={`flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${activeView === item.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
//                             >
//                                 <item.icon size={20} />
//                                 {!isSidebarCollapsed && <span>{item.label}</span>}
//                             </button>
//                         ))}
//                     </nav>
//                 </div>
//                 <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
//                     <button onClick={toggleTheme} className="flex items-center w-full gap-4 p-3 mb-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
//                         {!isSidebarCollapsed && <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>}
//                     </button>
//                     <button onClick={() => auth.signOut()} className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         <LogOut size={20} />
//                         {!isSidebarCollapsed && <span>Logout</span>}
//                     </button>
//                     <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="flex items-center w-full gap-4 p-3 mt-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         {isSidebarCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
//                         {!isSidebarCollapsed && <span>Collapse</span>}
//                     </button>
//                 </div>
//             </aside>
//             {/* Main Content */}
//             <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
//                 {renderView()}
//             </main>
//         </div>
//     );
// }


// import React, { useState, useEffect, useRef } from 'react';
// // Ensure you have these dependencies in your project:
// // npm install framer-motion lucide-react firebase
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Target, Repeat, CheckSquare, Library, BookOpen, LogOut, ChevronsLeft,
//     ChevronsRight, Plus, Sun, Moon, Trash2, RefreshCw, BellRing, BarChart2, Award,
//     TrendingUp, CheckCircle
// } from 'lucide-react';

// // --- Firebase Integration ---
// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import {
//     getFirestore, doc, addDoc, collection, onSnapshot,
//     deleteDoc, updateDoc, query, getDocs
// } from 'firebase/firestore';

// // Your actual Firebase config from src/firebase/config.js
// const firebaseConfig = {
//     apiKey: "AIzaSyBuO5owWE88vsxKDzNchsf4v4KiYXvWgMU",
//     authDomain: "quorith-78c19.firebaseapp.com",
//     projectId: "quorith-78c19",
//     storageBucket: "quorith-78c19.firebasestorage.app",
//     messagingSenderId: "913548830286",
//     appId: "1:913548830286:web:deedfd46b30eb2d2c0851f",
//     measurementId: "G-BJ60F0YTKQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Gemini API Key
// const GEMINI_API_KEY = "AIzaSyBoPo3gbqznM2DOU3fJ53u-_hS5bqRmKLk";


// // --- Helper Components ---
// const Modal = ({ children, isOpen, onClose }) => (
//     <AnimatePresence>
//         {isOpen && (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//                 onClick={onClose}
//             >
//                 <motion.div
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.9, opacity: 0 }}
//                     className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md p-6"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     {children}
//                 </motion.div>
//             </motion.div>
//         )}
//     </AnimatePresence>
// );

// // --- Feature View Components ---

// // 1. Plan View
// const PlanView = ({ userId }) => {
//     const [plans, setPlans] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [goal, setGoal] = useState('');
//     const [duration, setDuration] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isRecreating, setIsRecreating] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedPlan, setSelectedPlan] = useState(null);

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/plans`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const plansData = snapshot.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() }));
//             setPlans(plansData);
//         }, (err) => console.error("Firestore error in PlanView:", err));
//         return () => unsubscribe();
//     }, [userId]);

//     const generatePlanFromAPI = async (currentGoal, currentDuration) => {
//         const durationInDays = parseInt(currentDuration.match(/\d+/)[0], 10) || 30;
//         const prompt = `Create an extremely detailed, motivating, and structured day-by-day plan to achieve the goal: "${currentGoal}" over a period of ${currentDuration}. The user is looking for a rich, informative guide for each day. The plan should be progressive, meaning the tasks and focus should evolve and become more challenging or advanced over time. The output must be a valid JSON object. The root object should have a "dailyPlan" key, which is an array of objects, one for each day up to ${durationInDays}. Each daily object must contain: a "day" (number), a "theme" (string, e.g., "Foundation & Form"), a "detailedDescription" (string, a paragraph explaining the focus for the day), a list of "tasks" (array of strings), and a "motivationalTip" (string). Be thorough and inspiring.`;
        
//         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
//         const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { response_mime_type: "application/json" } };

//         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//         if (!response.ok) { const errorBody = await response.json(); throw new Error(`API Error: ${errorBody.error.message}`); }
//         const data = await response.json();
//         const planText = data.candidates[0].content.parts[0].text;
//         return JSON.parse(planText.replace(/```json|```/g, ''));
//     };

//     const handleCreatePlan = async (e) => {
//         e.preventDefault();
//         if (!goal || !duration) { setError('Please fill out all fields.'); return; }
//         setIsLoading(true); setError('');
//         try {
//             const planData = await generatePlanFromAPI(goal, duration);
//             await addDoc(collection(db, `users/${userId}/plans`), { goal, duration, dailyPlan: planData.dailyPlan, createdAt: new Date() });
//             setIsModalOpen(false); setGoal(''); setDuration('');
//         } catch (apiError) { setError(`Failed to generate plan: ${apiError.message}`); console.error(apiError); } 
//         finally { setIsLoading(false); }
//     };

//     const handleRecreatePlan = async () => {
//         if (!selectedPlan) return;
//         setIsRecreating(true); setError('');
//         try {
//             const newPlanData = await generatePlanFromAPI(selectedPlan.goal, selectedPlan.duration);
//             const planRef = doc(db, `users/${userId}/plans`, selectedPlan.id);
//             await updateDoc(planRef, { dailyPlan: newPlanData.dailyPlan });
//             setSelectedPlan(prev => ({...prev, dailyPlan: newPlanData.dailyPlan}));
//         } catch (apiError) { setError(`Failed to recreate plan: ${apiError.message}`); console.error(apiError); } 
//         finally { setIsRecreating(false); }
//     };
    
//     const deletePlan = async (e, planId) => {
//         e.stopPropagation();
//         if (window.confirm("Are you sure you want to delete this plan?")) {
//             await deleteDoc(doc(db, `users/${userId}/plans`, planId));
//             if(selectedPlan && selectedPlan.id === planId) setSelectedPlan(null);
//         }
//     }

//     const renderDailyPlan = (plan) => {
//         if (!plan.createdAt) return <div>Loading plan start date...</div>;
//         const startDate = plan.createdAt;
//         const today = new Date();
//         today.setHours(0,0,0,0);
//         startDate.setHours(0,0,0,0);
//         const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
//         const currentDayPlan = plan.dailyPlan.find(p => p.day === dayNumber);

//         if (!currentDayPlan) return <div className="text-center p-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg">Plan complete or no plan scheduled for today!</div>;

//         return (
//             <div className="p-4 md:p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
//                 <div className="text-center mb-6">
//                     <p className="text-sm font-semibold text-blue-500">DAY {currentDayPlan.day}</p>
//                     <h3 className="text-3xl font-bold mt-1">{currentDayPlan.theme}</h3>
//                 </div>
//                 <div className="bg-white dark:bg-black p-6 rounded-lg">
//                     <h4 className="font-semibold mb-2">Today's Focus:</h4>
//                     <p className="text-neutral-600 dark:text-neutral-300 mb-6">{currentDayPlan.detailedDescription}</p>
//                     <h4 className="font-semibold mb-3">Tasks for Today:</h4>
//                     <ul className="space-y-3 mb-6">
//                         {currentDayPlan.tasks.map((task, i) => (
//                             <li key={i} className="flex items-start gap-3"><CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} /><span>{task}</span></li>
//                         ))}
//                     </ul>
//                     <div className="bg-blue-500/10 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-r-lg">
//                         <h4 className="font-bold">Motivational Tip:</h4>
//                         <p className="mt-1 italic">{currentDayPlan.motivationalTip}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
//                 <h1 className="text-4xl font-bold">My Plans</h1>
//                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105 self-start md:self-center">
//                     <Plus size={20} /> New Plan
//                 </button>
//             </div>
            
//             {selectedPlan ? (
//                 <div>
//                     <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//                         <button onClick={() => setSelectedPlan(null)} className="text-sm font-semibold">&larr; Back to all plans</button>
//                         <h2 className="text-2xl font-bold text-center flex-grow">{selectedPlan.goal}</h2>
//                         <button onClick={handleRecreatePlan} disabled={isRecreating} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50">
//                             <RefreshCw size={14} className={isRecreating ? 'animate-spin' : ''} /> {isRecreating ? 'Recreating...' : 'Recreate Plan'}
//                         </button>
//                     </div>
//                     {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//                     {renderDailyPlan(selectedPlan)}
//                 </div>
//             ) : (
//                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {plans.map(plan => (
//                         <div key={plan.id} className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative group" onClick={() => setSelectedPlan(plan)}>
//                              <button onClick={(e) => deletePlan(e, plan.id)} className="absolute top-2 right-2 p-1 rounded-full bg-white/10 text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-opacity"><Trash2 size={16}/></button>
//                             <h3 className="font-bold text-xl mb-2">{plan.goal}</h3>
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400">Duration: {plan.duration}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Create a New Plan</h2>
//                 {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded-md">{error}</p>}
//                 <form onSubmit={handleCreatePlan}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">The Goal</label>
//                         <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., Get abs in 30 days" />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duration</label>
//                         <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., 30 days" />
//                     </div>
//                     <button type="submit" disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
//                         {isLoading ? 'Generating...' : 'Create Plan'}
//                     </button>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// // 2. Habit Tracker
// const HabitsView = ({ userId }) => {
//     const [habits, setHabits] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [habitName, setHabitName] = useState('');
//     const [days, setDays] = useState([]);
//     const [reminderTime, setReminderTime] = useState('');
//     const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

//     const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/habits`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             setHabits(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
//         });
//         return () => unsubscribe();
//     }, [userId]);
    
//     useEffect(() => {
//         if (notificationPermission !== 'granted') return;

//         const interval = setInterval(() => {
//             const now = new Date();
//             const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
//             const currentDay = weekDays[dayIndex];
//             const currentTime = now.toTimeString().slice(0, 5);
            
//             habits.forEach(habit => {
//                 if (habit.reminderTime === currentTime && habit.days.includes(currentDay)) {
//                     new Notification('Quorith Habit Reminder', {
//                         body: `It's time for: "${habit.name}"`,
//                         icon: '/logo.png' // Make sure you have a logo.png in your public folder
//                     });
//                 }
//             });
//         }, 60000); 
//         return () => clearInterval(interval);
//     }, [habits, notificationPermission, weekDays]);

//     const requestNotificationPermission = () => {
//         Notification.requestPermission().then(permission => {
//             setNotificationPermission(permission);
//         });
//     };

//     const handleDayToggle = (day) => {
//         setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
//     };

//     const handleAddHabit = async (e) => {
//         e.preventDefault();
//         if (!habitName || days.length === 0) return;
//         await addDoc(collection(db, `users/${userId}/habits`), {
//             name: habitName,
//             days,
//             reminderTime,
//             createdAt: new Date(),
//         });
//         setIsModalOpen(false);
//         setHabitName('');
//         setDays([]);
//         setReminderTime('');
//     };
    
//     const deleteHabit = async (id) => {
//         await deleteDoc(doc(db, `users/${userId}/habits`, id));
//     }

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-4xl font-bold">Habits</h1>
//                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105">
//                     <Plus size={20} /> New Habit
//                 </button>
//             </div>

//             {notificationPermission !== 'granted' && (
//                 <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg mb-6 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <BellRing size={20} />
//                         <p>Enable notifications to get reminders for your habits.</p>
//                     </div>
//                     {notificationPermission !== 'denied' && (
//                         <button onClick={requestNotificationPermission} className="font-semibold bg-yellow-400/20 px-3 py-1 rounded-md">Enable</button>
//                     )}
//                 </div>
//             )}

//             <div className="space-y-4">
//                 {habits.map(habit => (
//                     <div key={habit.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
//                         <div>
//                             <p className="font-semibold">{habit.name}</p>
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400">
//                                 {habit.days.join(', ')} {habit.reminderTime && `at ${habit.reminderTime}`}
//                             </p>
//                         </div>
//                         <button onClick={() => deleteHabit(habit.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
//                     </div>
//                 ))}
//             </div>
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                  <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Add New Habit</h2>
//                  <form onSubmit={handleAddHabit}>
//                     <input type="text" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder="e.g., Read for 30 minutes" className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 mb-4 text-black dark:text-white" />
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repeat on</label>
//                         <div className="flex flex-wrap gap-2">
//                             {weekDays.map(day => (
//                                 <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${days.includes(day) ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-200 dark:bg-neutral-800'}`}>{day.slice(0,1)}</button>
//                             ))}
//                         </div>
//                         <button type="button" onClick={() => setDays(weekDays)} className="text-sm mt-2 font-semibold text-black dark:text-white">Set to Daily</button>
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reminder Time (optional)</label>
//                         <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
//                     </div>
//                     <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Add Habit</button>
//                  </form>
//             </Modal>
//         </div>
//     );
// };

// // 3. To-Do List
// const TodosView = ({ userId }) => {
//     const [todos, setTodos] = useState([]);
//     const [aiTodos, setAiTodos] = useState([]);
//     const [task, setTask] = useState('');
//     const [priority, setPriority] = useState('medium');
//     const [isLoadingAiTasks, setIsLoadingAiTasks] = useState(true);

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/todos`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             setTodos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
//         });

//         const fetchAiTasks = async () => {
//             setIsLoadingAiTasks(true);
//             const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//             const cacheKey = `ai-todos-${userId}-${today}`;
//             const cachedData = localStorage.getItem(cacheKey);

//             if (cachedData) {
//                 setAiTodos(JSON.parse(cachedData));
//                 setIsLoadingAiTasks(false);
//                 return;
//             }

//             const plansQuery = query(collection(db, `users/${userId}/plans`));
//             const plansSnapshot = await getDocs(plansQuery);
//             if (plansSnapshot.empty) {
//                 setAiTodos([]);
//                 setIsLoadingAiTasks(false);
//                 return;
//             }
            
//             const firstPlan = plansSnapshot.docs[0].data(); 
//             const prompt = `Based on this plan: ${JSON.stringify(firstPlan.dailyPlan)}, what are the top 3 most important tasks for today? Respond with a simple JSON array of strings.`;
            
//             const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
//             const payload = { contents: [{ parts: [{ text: prompt }] }] };

//             try {
//                 const response = await fetch(apiUrl, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 });
//                 if (!response.ok) throw new Error("AI task generation failed");
//                 const data = await response.json();
//                 const tasksText = data.candidates[0].content.parts[0].text;
//                 const tasks = JSON.parse(tasksText.replace(/```json|```/g, ''));
//                 setAiTodos(tasks);
//                 localStorage.setItem(cacheKey, JSON.stringify(tasks));
//             } catch (error) {
//                 console.error("Failed to fetch AI tasks:", error);
//                 setAiTodos(["Could not fetch AI tasks."]);
//             } finally {
//                 setIsLoadingAiTasks(false);
//             }
//         };
//         fetchAiTasks();

//         return () => unsubscribe();
//     }, [userId]);

//     const handleAddTask = async (e) => {
//         e.preventDefault();
//         if (!task) return;
//         await addDoc(collection(db, `users/${userId}/todos`), {
//             task,
//             priority,
//             completed: false,
//             createdAt: new Date(),
//         });
//         setTask('');
//         setPriority('medium');
//     };

//     const toggleComplete = async (todo) => {
//         await updateDoc(doc(db, `users/${userId}/todos`, todo.id), { completed: !todo.completed });
//     };

//     const deleteTask = async (id) => {
//         await deleteDoc(doc(db, `users/${userId}/todos`, id));
//     };

//     const priorityColor = {
//         high: 'border-red-500',
//         medium: 'border-yellow-500',
//         low: 'border-green-500',
//     };

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">To-Do List</h1>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                     <h2 className="text-2xl font-semibold mb-4">AI Suggested Tasks</h2>
//                     <div className="space-y-3">
//                         {isLoadingAiTasks ? <p className="text-neutral-500">Generating today's tasks...</p> : 
//                          aiTodos.length > 0 ? aiTodos.map((aiTask, i) => (
//                             <div key={i} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg border-l-4 border-blue-500">
//                                 <p>{aiTask}</p>
//                             </div>
//                         )) : <p className="text-neutral-500">No AI tasks available. Create a plan first!</p>}
//                     </div>
//                 </div>
//                 <div>
//                     <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
//                     <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
//                         <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Add a new task" className="flex-grow p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
//                         <select value={priority} onChange={e => setPriority(e.target.value)} className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white">
//                             <option value="high">High</option>
//                             <option value="medium">Medium</option>
//                             <option value="low">Low</option>
//                         </select>
//                         <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-3 rounded-lg"><Plus size={20}/></button>
//                     </form>
//                     <div className="space-y-3">
//                         {todos.map(todo => (
//                             <div key={todo.id} className={`bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex items-center justify-between border-l-4 ${priorityColor[todo.priority]}`}>
//                                 <div className="flex items-center gap-3">
//                                     <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} className="h-5 w-5 rounded text-black dark:text-white focus:ring-0" />
//                                     <span className={todo.completed ? 'line-through text-neutral-500' : ''}>{todo.task}</span>
//                                 </div>
//                                 <button onClick={() => deleteTask(todo.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // 4. Analytics View
// const AnalyticsView = ({ userId }) => {
//     const [stats, setStats] = useState({
//         taskCompletion: 0,
//         journalStreak: 0,
//         habitsTracked: 0,
//     });
//     const [badges, setBadges] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!userId) return;

//         const fetchData = async () => {
//             setLoading(true);
//             // Fetch Todos
//             const todosQuery = query(collection(db, `users/${userId}/todos`));
//             const todosSnapshot = await getDocs(todosQuery);
//             const todosData = todosSnapshot.docs.map(d => d.data());
//             const completedTasks = todosData.filter(t => t.completed).length;
//             const taskCompletion = todosData.length > 0 ? Math.round((completedTasks / todosData.length) * 100) : 0;

//             // Fetch Journal Entries for streak calculation
//             const journalQuery = query(collection(db, `users/${userId}/journal`));
//             const journalSnapshot = await getDocs(journalQuery);
//             const journalDates = journalSnapshot.docs.map(d => d.data().createdAt.toDate().toISOString().split('T')[0]);
//             const uniqueJournalDates = [...new Set(journalDates)].sort().reverse();
            
//             let journalStreak = 0;
//             if (uniqueJournalDates.length > 0) {
//                 const today = new Date();
//                 const yesterday = new Date(today);
//                 yesterday.setDate(today.getDate() - 1);

//                 if (uniqueJournalDates[0] === today.toISOString().split('T')[0] || uniqueJournalDates[0] === yesterday.toISOString().split('T')[0]) {
//                     journalStreak = 1;
//                     for (let i = 0; i < uniqueJournalDates.length - 1; i++) {
//                         const currentDate = new Date(uniqueJournalDates[i]);
//                         const nextDate = new Date(uniqueJournalDates[i+1]);
//                         const diff = (currentDate - nextDate) / (1000 * 60 * 60 * 24);
//                         if (diff === 1) {
//                             journalStreak++;
//                         } else {
//                             break;
//                         }
//                     }
//                 }
//             }

//             // Fetch Habits
//             const habitsQuery = query(collection(db, `users/${userId}/habits`));
//             const habitsSnapshot = await getDocs(habitsQuery);
//             const habitsTracked = habitsSnapshot.docs.length;

//             const newStats = { taskCompletion, journalStreak, habitsTracked };
//             setStats(newStats);

//             // Fetch plans for badge calculation
//             const plansQuery = query(collection(db, `users/${userId}/plans`));
//             const plansSnapshot = await getDocs(plansQuery);
//             const plans = plansSnapshot.docs.map(d => d.data());

//             // Calculate Badges
//             const newBadges = [];
//             if (journalStreak >= 7) newBadges.push({ name: "7-Day Journaler", icon: Award, color: "text-blue-500", description: "Wrote in your journal for 7 consecutive days." });
//             if (journalStreak >= 3) newBadges.push({ name: "Consistent Scribe", icon: Award, color: "text-green-500", description: "Wrote in your journal for 3 consecutive days." });
//             if (taskCompletion === 100 && todosData.length > 5) newBadges.push({ name: "Task Master", icon: Award, color: "text-yellow-500", description: "Completed all your tasks!" });
//             if (plans.length > 0) newBadges.push({ name: "Planner", icon: Award, color: "text-purple-500", description: "Created your first plan." });
//             setBadges(newBadges);

//             setLoading(false);
//         };
        
//         // Use onSnapshot to listen for changes in all relevant collections
//         const unsubTodos = onSnapshot(query(collection(db, `users/${userId}/todos`)), () => fetchData());
//         const unsubJournal = onSnapshot(query(collection(db, `users/${userId}/journal`)), () => fetchData());
//         const unsubHabits = onSnapshot(query(collection(db, `users/${userId}/habits`)), () => fetchData());
//         const unsubPlans = onSnapshot(query(collection(db, `users/${userId}/plans`)), () => fetchData());

//         return () => {
//             unsubTodos();
//             unsubJournal();
//             unsubHabits();
//             unsubPlans();
//         };
//     }, [userId]);

//     if (loading) return <div>Loading analytics...</div>;

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">Analytics</h1>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
//                     <TrendingUp size={32} className="mx-auto mb-2 text-green-500" />
//                     <p className="text-4xl font-bold">{stats.taskCompletion}%</p>
//                     <p className="text-neutral-500 dark:text-neutral-400">Task Completion</p>
//                 </div>
//                 <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
//                     <Repeat size={32} className="mx-auto mb-2 text-blue-500" />
//                     <p className="text-4xl font-bold">{stats.journalStreak}</p>
//                     <p className="text-neutral-500 dark:text-neutral-400">Day Journal Streak</p>
//                 </div>
//                  <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
//                     <CheckSquare size={32} className="mx-auto mb-2 text-purple-500" />
//                     <p className="text-4xl font-bold">{stats.habitsTracked}</p>
//                     <p className="text-neutral-500 dark:text-neutral-400">Habits Tracked</p>
//                 </div>
//             </div>
//             <div>
//                 <h2 className="text-2xl font-semibold mb-4">Badges & Achievements</h2>
//                 {badges.length > 0 ? (
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {badges.map(badge => (
//                             <div key={badge.name} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg text-center flex flex-col items-center">
//                                 <badge.icon size={40} className={`mb-2 ${badge.color}`} />
//                                 <p className="font-semibold">{badge.name}</p>
//                                 <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{badge.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ) : <p className="text-neutral-500">No badges earned yet. Keep up the great work!</p>}
//             </div>
//         </div>
//     )
// };

// // 5. Library
// const LibraryView = () => {
//     // This component remains unchanged from the previous version
//     const [books, setBooks] = useState([
//         {
//             id: 1,
//             title: "Atomic Habits",
//             author: "James Clear",
//             chapters: [
//                 { title: "The Fundamentals", content: "Why small habits make a big difference. The surprising power of atomic habits. How your habits shape your identity (and vice versa)." },
//                 { title: "The 1st Law: Make It Obvious", content: "How to create powerful cues in your environment to trigger good habits. The best way to start a new habit. The role of location and time in habit formation." },
//             ]
//         },
//         {
//             id: 2,
//             title: "Deep Work",
//             author: "Cal Newport",
//             chapters: [
//                 { title: "The Deep Work Hypothesis", content: "The ability to perform deep work is becoming increasingly rare at the exact same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive." },
//             ]
//         }
//     ]);
//     const [selectedBook, setSelectedBook] = useState(null);

//     if (selectedBook) {
//         return (
//             <div>
//                 <button onClick={() => setSelectedBook(null)} className="mb-4 text-sm font-semibold">&larr; Back to library</button>
//                 <h1 className="text-4xl font-bold">{selectedBook.title}</h1>
//                 <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">{selectedBook.author}</p>
//                 <div className="space-y-6">
//                     {selectedBook.chapters.map(chapter => (
//                         <div key={chapter.title}>
//                             <h3 className="text-2xl font-semibold mb-2">{chapter.title}</h3>
//                             <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{chapter.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">Library</h1>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {books.map(book => (
//                     <div key={book.id} onClick={() => setSelectedBook(book)} className="cursor-pointer group">
//                         <div className="bg-neutral-300 dark:bg-neutral-800 h-64 rounded-lg flex items-center justify-center p-4 text-center font-bold text-black dark:text-white transition-transform group-hover:scale-105">
//                             {book.title}
//                         </div>
//                         <h3 className="font-semibold mt-2">{book.title}</h3>
//                         <p className="text-sm text-neutral-500 dark:text-neutral-400">{book.author}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // 6. Journal
// const JournalView = ({ userId }) => {
//     const [entries, setEntries] = useState([]);
//     const [newEntry, setNewEntry] = useState('');

//     useEffect(() => {
//         if (!userId) return;
//         const q = query(collection(db, `users/${userId}/journal`));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const sortedEntries = snapshot.docs
//                 .map(d => ({ id: d.id, ...d.data() }))
//                 .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
//             setEntries(sortedEntries);
//         });
//         return () => unsubscribe();
//     }, [userId]);

//     const handleSaveEntry = async () => {
//         if (!newEntry) return;
//         await addDoc(collection(db, `users/${userId}/journal`), {
//             content: newEntry,
//             createdAt: new Date(),
//         });
//         setNewEntry('');
//     };

//     return (
//         <div>
//             <h1 className="text-4xl font-bold mb-8">Journal</h1>
//             <div className="mb-8">
//                 <textarea 
//                     value={newEntry}
//                     onChange={e => setNewEntry(e.target.value)}
//                     placeholder="How did today go?"
//                     className="w-full h-40 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
//                 ></textarea>
//                 <button onClick={handleSaveEntry} className="mt-4 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Save Entry</button>
//             </div>
//             <div>
//                 <h2 className="text-2xl font-semibold mb-4">Past Entries</h2>
//                 <div className="space-y-4">
//                     {entries.map(entry => (
//                         <div key={entry.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg">
//                             <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
//                                 {entry.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                             </p>
//                             <p className="whitespace-pre-wrap">{entry.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Dashboard Page Component ---

// export default function DashboardPage() {
//     const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
//     const [activeView, setActiveView] = useState('plan');
//     const [theme, setTheme] = useState(() => {
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme) return savedTheme;
//         return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//     });
//     const [currentUser, setCurrentUser] = useState(null);
//     const [authReady, setAuthReady] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth < 768) setIsSidebarCollapsed(true);
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, user => {
//             setCurrentUser(user);
//             setAuthReady(true);
//         });
//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         if (theme === 'dark') {
//             document.documentElement.classList.add('dark');
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//             localStorage.setItem('theme', 'light');
//         }
//     }, [theme]);

//     const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

//     const renderView = () => {
//         if (!authReady) return <div className="text-center p-10">Authenticating...</div>;
//         if (!currentUser) return <div className="text-center p-10">No user is signed in. Please log in to continue.</div>;

//         switch (activeView) {
//             case 'plan': return <PlanView userId={currentUser.uid} />;
//             case 'habits': return <HabitsView userId={currentUser.uid} />;
//             case 'todos': return <TodosView userId={currentUser.uid} />;
//             case 'analytics': return <AnalyticsView userId={currentUser.uid} />;
//             case 'library': return <LibraryView />;
//             case 'journal': return <JournalView userId={currentUser.uid} />;
//             default: return <PlanView userId={currentUser.uid} />;
//         }
//     };

//     const navItems = [
//         { id: 'plan', label: 'My Plan', icon: Target },
//         { id: 'habits', label: 'Habits', icon: Repeat },
//         { id: 'todos', label: 'To-Do List', icon: CheckSquare },
//         { id: 'analytics', label: 'Analytics', icon: BarChart2 },
//         { id: 'library', label: 'Library', icon: Library },
//         { id: 'journal', label: 'Journal', icon: BookOpen },
//     ];

//     return (
//         <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white font-sans relative overflow-hidden">
//             <aside className={`flex flex-col justify-between bg-neutral-100 dark:bg-neutral-900 p-4 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
//                 <div>
//                     <div className="flex items-center gap-2 mb-10 h-8">
//                         <div className="bg-black dark:bg-white rounded p-1">
//                           <Target className="text-white dark:text-black" />
//                         </div>
//                         {!isSidebarCollapsed && <h1 className="text-xl font-bold">Quorith</h1>}
//                     </div>
//                     <nav className="flex flex-col gap-2">
//                         {navItems.map((item) => (
//                             <button 
//                                 key={item.id}
//                                 onClick={() => setActiveView(item.id)}
//                                 className={`flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${activeView === item.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
//                             >
//                                 <item.icon size={20} />
//                                 {!isSidebarCollapsed && <span>{item.label}</span>}
//                             </button>
//                         ))}
//                     </nav>
//                 </div>
//                 <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
//                     <button onClick={toggleTheme} className="flex items-center w-full gap-4 p-3 mb-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
//                         {!isSidebarCollapsed && <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>}
//                     </button>
//                     <button onClick={() => auth.signOut()} className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         <LogOut size={20} />
//                         {!isSidebarCollapsed && <span>Logout</span>}
//                     </button>
//                     <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="flex items-center w-full gap-4 p-3 mt-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
//                         {isSidebarCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
//                         {!isSidebarCollapsed && <span>Collapse</span>}
//                     </button>
//                 </div>
//             </aside>
//             <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
//                 {renderView()}
//             </main>
//         </div>
//     );
// }


import React, { useState, useEffect, useRef } from 'react';
// Ensure you have these dependencies in your project:
// npm install framer-motion lucide-react firebase
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Repeat, CheckSquare, Library, BookOpen, LogOut, ChevronsLeft,
    ChevronsRight, Plus, Sun, Moon, Trash2, RefreshCw, BellRing, BarChart2, Award,
    TrendingUp, CheckCircle, Zap, ExternalLink
} from 'lucide-react';

// --- Firebase Integration ---
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getFirestore, doc, addDoc, collection, onSnapshot,
    deleteDoc, updateDoc, query, getDocs
} from 'firebase/firestore';

// Your actual Firebase config from src/firebase/config.js
const firebaseConfig = {
    apiKey: "AIzaSyBuO5owWE88vsxKDzNchsf4v4KiYXvWgMU",
    authDomain: "quorith-78c19.firebaseapp.com",
    projectId: "quorith-78c19",
    storageBucket: "quorith-78c19.firebasestorage.app",
    messagingSenderId: "913548830286",
    appId: "1:913548830286:web:deedfd46b30eb2d2c0851f",
    measurementId: "G-BJ60F0YTKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyBoPo3gbqznM2DOU3fJ53u-_hS5bqRmKLk";


// --- Helper Components ---
const Modal = ({ children, isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Feature View Components ---

// 1. Plan View
const PlanView = ({ userId }) => {
    const [plans, setPlans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecreating, setIsRecreating] = useState(false);
    const [error, setError] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, `users/${userId}/plans`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const plansData = snapshot.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() }));
            setPlans(plansData);
        }, (err) => console.error("Firestore error in PlanView:", err));
        return () => unsubscribe();
    }, [userId]);

    const generatePlanFromAPI = async (currentGoal, currentDuration) => {
        const durationInDays = parseInt(currentDuration.match(/\d+/)[0], 10) || 30;
        const prompt = `Act as an expert life and performance coach. Create an extremely detailed, motivating, and structured day-by-day plan to achieve the goal: "${currentGoal}" over a period of ${currentDuration}. The plan must be progressive, building on previous days. The output must be a valid JSON object. The root object must have a "dailyPlan" key, which is an array of objects, one for each day up to ${durationInDays}. Each daily object must contain: "day" (number), "theme" (string, e.g., "Foundation & Form"), "philosophy" (string, a short, inspiring thought for the day), "detailedDescription" (string, a detailed paragraph explaining the 'why' behind today's focus), a "schedule" (array of strings, e.g., "7:00 AM: Morning Mobility Routine"), "tasks" (array of objects, each with a "name" and a detailed "details" string explaining how to perform the task), "resources" (array of objects, each with a "type" like 'Video' or 'Article' and a "description" like 'Search for "Proper push-up form" on YouTube'), and a "progressCheck" (string, a reflective question for the user). Be extremely thorough and provide rich, actionable content for every field.`;
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { response_mime_type: "application/json" } };

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { const errorBody = await response.json(); throw new Error(`API Error: ${errorBody.error.message}`); }
        const data = await response.json();
        const planText = data.candidates[0].content.parts[0].text;
        return JSON.parse(planText.replace(/```json|```/g, ''));
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        if (!goal || !duration) { setError('Please fill out all fields.'); return; }
        setIsLoading(true); setError('');
        try {
            const planData = await generatePlanFromAPI(goal, duration);
            await addDoc(collection(db, `users/${userId}/plans`), { goal, duration, dailyPlan: planData.dailyPlan, createdAt: new Date() });
            setIsModalOpen(false); setGoal(''); setDuration('');
        } catch (apiError) { setError(`Failed to generate plan: ${apiError.message}`); console.error(apiError); } 
        finally { setIsLoading(false); }
    };

    const handleRecreatePlan = async () => {
        if (!selectedPlan) return;
        setIsRecreating(true); setError('');
        try {
            const newPlanData = await generatePlanFromAPI(selectedPlan.goal, selectedPlan.duration);
            const planRef = doc(db, `users/${userId}/plans`, selectedPlan.id);
            await updateDoc(planRef, { dailyPlan: newPlanData.dailyPlan });
            setSelectedPlan(prev => ({...prev, dailyPlan: newPlanData.dailyPlan}));
        } catch (apiError) { setError(`Failed to recreate plan: ${apiError.message}`); console.error(apiError); } 
        finally { setIsRecreating(false); }
    };
    
    const deletePlan = async (e, planId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this plan?")) {
            await deleteDoc(doc(db, `users/${userId}/plans`, planId));
            if(selectedPlan && selectedPlan.id === planId) setSelectedPlan(null);
        }
    }

    const renderDailyPlan = (plan) => {
        if (!plan.createdAt) return <div>Loading plan start date...</div>;
        const startDate = plan.createdAt;
        const today = new Date();
        today.setHours(0,0,0,0);
        startDate.setHours(0,0,0,0);
        const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const currentDayPlan = plan.dailyPlan.find(p => p.day === dayNumber);

        if (!currentDayPlan) return <div className="text-center p-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg">Plan complete or no plan scheduled for today!</div>;

        return (
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                <div className="text-center p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm font-semibold text-blue-500">DAY {currentDayPlan.day}</p>
                    <h3 className="text-3xl font-bold mt-1">{currentDayPlan.theme}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 italic">"{currentDayPlan.philosophy}"</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-black p-6 rounded-lg space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2 text-lg">Today's Focus</h4>
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{currentDayPlan.detailedDescription}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-lg">Actionable Tasks</h4>
                            <ul className="space-y-4">
                                {currentDayPlan.tasks.map((task, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-md">
                                        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="font-semibold">{task.name}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{task.details}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-black p-6 rounded-lg space-y-6">
                        {currentDayPlan.schedule && (
                            <div>
                                <h4 className="font-semibold mb-3 text-lg">Suggested Schedule</h4>
                                <ul className="space-y-2">
                                    {currentDayPlan.schedule.map((item, i) => (
                                        <li key={i} className="text-sm text-neutral-700 dark:text-neutral-300">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {currentDayPlan.resources && currentDayPlan.resources.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 text-lg">Helpful Resources</h4>
                                <ul className="space-y-2">
                                    {currentDayPlan.resources.map((res, i) => (
                                        <li key={i} className="text-sm text-blue-500 hover:underline flex items-center gap-2">
                                            <ExternalLink size={14}/> <strong>{res.type}:</strong> {res.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="bg-blue-500/10 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-r-lg">
                            <h4 className="font-bold">Progress Check</h4>
                            <p className="mt-1 italic">{currentDayPlan.progressCheck}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold">My Plans</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105 self-start md:self-center">
                    <Plus size={20} /> New Plan
                </button>
            </div>
            
            {selectedPlan ? (
                <div>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <button onClick={() => setSelectedPlan(null)} className="text-sm font-semibold">&larr; Back to all plans</button>
                        <h2 className="text-2xl font-bold text-center flex-grow">{selectedPlan.goal}</h2>
                        <button onClick={handleRecreatePlan} disabled={isRecreating} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 disabled:opacity-50">
                            <RefreshCw size={14} className={isRecreating ? 'animate-spin' : ''} /> {isRecreating ? 'Recreating...' : 'Recreate Plan'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {renderDailyPlan(selectedPlan)}
                </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative group" onClick={() => setSelectedPlan(plan)}>
                             <button onClick={(e) => deletePlan(e, plan.id)} className="absolute top-2 right-2 p-1 rounded-full bg-white/10 text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-opacity"><Trash2 size={16}/></button>
                            <h3 className="font-bold text-xl mb-2">{plan.goal}</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Duration: {plan.duration}</p>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Create a New Plan</h2>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded-md">{error}</p>}
                <form onSubmit={handleCreatePlan}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">The Goal</label>
                        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., Get abs in 30 days" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duration</label>
                        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" placeholder="e.g., 30 days" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
                        {isLoading ? 'Generating...' : 'Create Plan'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

// 2. Habit Tracker
const HabitsView = ({ userId }) => {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [habitName, setHabitName] = useState('');
    const [days, setDays] = useState([]);
    const [reminderTime, setReminderTime] = useState('');
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, `users/${userId}/habits`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setHabits(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, [userId]);
    
    useEffect(() => {
        if (notificationPermission !== 'granted') return;

        const interval = setInterval(() => {
            const now = new Date();
            const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
            const currentDay = weekDays[dayIndex];
            const currentTime = now.toTimeString().slice(0, 5);
            
            habits.forEach(habit => {
                if (habit.reminderTime === currentTime && habit.days.includes(currentDay)) {
                    new Notification('Quorith Habit Reminder', {
                        body: `It's time for: "${habit.name}"`,
                        icon: '/logo.png' // Make sure you have a logo.png in your public folder
                    });
                }
            });
        }, 60000); 
        return () => clearInterval(interval);
    }, [habits, notificationPermission, weekDays]);

    const requestNotificationPermission = () => {
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
        });
    };

    const handleDayToggle = (day) => {
        setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!habitName || days.length === 0) return;
        await addDoc(collection(db, `users/${userId}/habits`), {
            name: habitName,
            days,
            reminderTime,
            createdAt: new Date(),
        });
        setIsModalOpen(false);
        setHabitName('');
        setDays([]);
        setReminderTime('');
    };
    
    const deleteHabit = async (id) => {
        await deleteDoc(doc(db, `users/${userId}/habits`, id));
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Habits</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-transform hover:scale-105">
                    <Plus size={20} /> New Habit
                </button>
            </div>

            {notificationPermission !== 'granted' && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BellRing size={20} />
                        <p>Enable notifications to get reminders for your habits.</p>
                    </div>
                    {notificationPermission !== 'denied' && (
                        <button onClick={requestNotificationPermission} className="font-semibold bg-yellow-400/20 px-3 py-1 rounded-md">Enable</button>
                    )}
                </div>
            )}

            <div className="space-y-4">
                {habits.map(habit => (
                    <div key={habit.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{habit.name}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {habit.days.join(', ')} {habit.reminderTime && `at ${habit.reminderTime}`}
                            </p>
                        </div>
                        <button onClick={() => deleteHabit(habit.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                 <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Add New Habit</h2>
                 <form onSubmit={handleAddHabit}>
                    <input type="text" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder="e.g., Read for 30 minutes" className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 mb-4 text-black dark:text-white" />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repeat on</label>
                        <div className="flex flex-wrap gap-2">
                            {weekDays.map(day => (
                                <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${days.includes(day) ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-200 dark:bg-neutral-800'}`}>{day.slice(0,1)}</button>
                            ))}
                        </div>
                        <button type="button" onClick={() => setDays(weekDays)} className="text-sm mt-2 font-semibold text-black dark:text-white">Set to Daily</button>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reminder Time (optional)</label>
                        <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
                    </div>
                    <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Add Habit</button>
                 </form>
            </Modal>
        </div>
    );
};

// 3. To-Do List
const TodosView = ({ userId }) => {
    const [todos, setTodos] = useState([]);
    const [aiTodos, setAiTodos] = useState([]);
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const [isLoadingAiTasks, setIsLoadingAiTasks] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, `users/${userId}/todos`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTodos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const fetchAiTasks = async () => {
            setIsLoadingAiTasks(true);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const cacheKey = `ai-todos-${userId}-${today}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setAiTodos(JSON.parse(cachedData));
                setIsLoadingAiTasks(false);
                return;
            }

            const plansQuery = query(collection(db, `users/${userId}/plans`));
            const plansSnapshot = await getDocs(plansQuery);
            if (plansSnapshot.empty) {
                setAiTodos([]);
                setIsLoadingAiTasks(false);
                return;
            }
            
            const allPlansContext = plansSnapshot.docs.map(doc => doc.data().goal).join('; ');
            const prompt = `Based on the user's overall goals (${allPlansContext}), what are the top 3 most critical tasks for today? Respond with a simple JSON array of strings.`;
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }] };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error("AI task generation failed");
                const data = await response.json();
                const tasksText = data.candidates[0].content.parts[0].text;
                const tasks = JSON.parse(tasksText.replace(/```json|```/g, ''));
                setAiTodos(tasks);
                localStorage.setItem(cacheKey, JSON.stringify(tasks));
            } catch (error) {
                console.error("Failed to fetch AI tasks:", error);
                setAiTodos(["Could not fetch AI tasks."]);
            } finally {
                setIsLoadingAiTasks(false);
            }
        };
        fetchAiTasks();

        return () => unsubscribe();
    }, [userId]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!task) return;
        await addDoc(collection(db, `users/${userId}/todos`), {
            task,
            priority,
            completed: false,
            createdAt: new Date(),
        });
        setTask('');
        setPriority('medium');
    };

    const toggleComplete = async (todo) => {
        await updateDoc(doc(db, `users/${userId}/todos`, todo.id), { completed: !todo.completed });
    };

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, `users/${userId}/todos`, id));
    };

    const priorityColor = {
        high: 'border-red-500',
        medium: 'border-yellow-500',
        low: 'border-green-500',
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">To-Do List</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">AI Suggested Tasks</h2>
                    <div className="space-y-3">
                        {isLoadingAiTasks ? <p className="text-neutral-500">Generating today's tasks...</p> : 
                         aiTodos.length > 0 ? aiTodos.map((aiTask, i) => (
                            <div key={i} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg border-l-4 border-blue-500">
                                <p>{aiTask}</p>
                            </div>
                        )) : <p className="text-neutral-500">No AI tasks available. Create a plan first!</p>}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                        <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Add a new task" className="flex-grow p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white" />
                        <select value={priority} onChange={e => setPriority(e.target.value)} className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button type="submit" className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-3 rounded-lg"><Plus size={20}/></button>
                    </form>
                    <div className="space-y-3">
                        {todos.map(todo => (
                            <div key={todo.id} className={`bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg flex items-center justify-between border-l-4 ${priorityColor[todo.priority]}`}>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} className="h-5 w-5 rounded text-black dark:text-white focus:ring-0" />
                                    <span className={todo.completed ? 'line-through text-neutral-500' : ''}>{todo.task}</span>
                                </div>
                                <button onClick={() => deleteTask(todo.id)} className="text-neutral-400 hover:text-red-500"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. Analytics View
const AnalyticsView = ({ userId }) => {
    const [stats, setStats] = useState({
        taskCompletion: 0,
        journalStreak: 0,
        habitsTracked: 0,
    });
    const [badges, setBadges] = useState([]);
    const [weeklyTasks, setWeeklyTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            // Fetch Todos for stats and chart
            const todosQuery = query(collection(db, `users/${userId}/todos`));
            const todosSnapshot = await getDocs(todosQuery);
            const todosData = todosSnapshot.docs.map(d => ({...d.data(), createdAt: d.data().createdAt.toDate()}));
            const completedTasks = todosData.filter(t => t.completed).length;
            const taskCompletion = todosData.length > 0 ? Math.round((completedTasks / todosData.length) * 100) : 0;

            // Process weekly task data for chart
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            const weeklyData = last7Days.map(dateStr => {
                const dayTasks = todosData.filter(t => t.createdAt.toISOString().split('T')[0] === dateStr);
                const completed = dayTasks.filter(t => t.completed).length;
                return { date: dateStr.slice(5), completed, total: dayTasks.length };
            });
            setWeeklyTasks(weeklyData);

            // Fetch Journal Entries for streak calculation
            const journalQuery = query(collection(db, `users/${userId}/journal`));
            const journalSnapshot = await getDocs(journalQuery);
            const journalDates = journalSnapshot.docs.map(d => d.data().createdAt.toDate().toISOString().split('T')[0]);
            const uniqueJournalDates = [...new Set(journalDates)].sort().reverse();
            
            let journalStreak = 0;
            if (uniqueJournalDates.length > 0) {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                if (uniqueJournalDates[0] === today.toISOString().split('T')[0] || uniqueJournalDates[0] === yesterday.toISOString().split('T')[0]) {
                    journalStreak = 1;
                    for (let i = 0; i < uniqueJournalDates.length - 1; i++) {
                        const currentDate = new Date(uniqueJournalDates[i]);
                        const nextDate = new Date(uniqueJournalDates[i+1]);
                        const diff = (currentDate - nextDate) / (1000 * 60 * 60 * 24);
                        if (diff === 1) {
                            journalStreak++;
                        } else {
                            break;
                        }
                    }
                }
            }

            // Fetch Habits
            const habitsQuery = query(collection(db, `users/${userId}/habits`));
            const habitsSnapshot = await getDocs(habitsQuery);
            const habitsTracked = habitsSnapshot.docs.length;

            const newStats = { taskCompletion, journalStreak, habitsTracked };
            setStats(newStats);

            // Fetch plans for badge calculation
            const plansQuery = query(collection(db, `users/${userId}/plans`));
            const plansSnapshot = await getDocs(plansQuery);
            const plans = plansSnapshot.docs.map(d => d.data());

            // Calculate Badges
            const newBadges = [];
            if (journalStreak >= 7) newBadges.push({ name: "7-Day Journaler", icon: Award, color: "text-blue-500", description: "Wrote in your journal for 7 consecutive days." });
            if (journalStreak >= 3) newBadges.push({ name: "Consistent Scribe", icon: Award, color: "text-green-500", description: "Wrote in your journal for 3 consecutive days." });
            if (taskCompletion === 100 && todosData.length > 5) newBadges.push({ name: "Task Master", icon: Award, color: "text-yellow-500", description: "Completed all your tasks!" });
            if (plans.length > 0) newBadges.push({ name: "Planner", icon: Award, color: "text-purple-500", description: "Created your first plan." });
            setBadges(newBadges);

            setLoading(false);
        };
        
        // Use onSnapshot to listen for changes in all relevant collections
        const unsubTodos = onSnapshot(query(collection(db, `users/${userId}/todos`)), () => fetchData());
        const unsubJournal = onSnapshot(query(collection(db, `users/${userId}/journal`)), () => fetchData());
        const unsubHabits = onSnapshot(query(collection(db, `users/${userId}/habits`)), () => fetchData());
        const unsubPlans = onSnapshot(query(collection(db, `users/${userId}/plans`)), () => fetchData());

        return () => { unsubTodos(); unsubJournal(); unsubHabits(); unsubPlans(); };
    }, [userId]);

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
                    <TrendingUp size={32} className="mx-auto mb-2 text-green-500" />
                    <p className="text-4xl font-bold">{stats.taskCompletion}%</p>
                    <p className="text-neutral-500 dark:text-neutral-400">Task Completion</p>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                    <Zap size={32} className="mx-auto mb-2 text-yellow-500" />
                    <p className="text-4xl font-bold">{stats.journalStreak}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">Day Journal Streak</p>
                </div>
                 <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
                    <Repeat size={32} className="mx-auto mb-2 text-blue-500" />
                    <p className="text-4xl font-bold">{stats.habitsTracked}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">Habits Tracked</p>
                </div>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">Weekly Task Performance</h2>
                <div className="flex justify-around items-end h-48">
                    {weeklyTasks.map((day, i) => (
                        <div key={i} className="flex flex-col items-center w-1/12">
                            <div className="w-full h-full flex flex-col-reverse rounded-t-md bg-neutral-200 dark:bg-neutral-800">
                                <motion.div
                                    className="w-full bg-green-500 rounded-t-md"
                                    initial={{ height: 0 }}
                                    animate={{ height: day.total > 0 ? `${(day.completed / day.total) * 100}%` : '0%' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs mt-2 text-neutral-500 dark:text-neutral-400">{day.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Badges & Achievements</h2>
                {badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map(badge => (
                            <div key={badge.name} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg text-center flex flex-col items-center">
                                <badge.icon size={40} className={`mb-2 ${badge.color}`} />
                                <p className="font-semibold">{badge.name}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-neutral-500">No badges earned yet. Keep up the great work!</p>}
            </div>
        </div>
    )
};

// 5. Library
const LibraryView = () => {
    // This component remains unchanged from the previous version
    const [books, setBooks] = useState([
        {
  id: 1,
  title: "Atomic Habits",
  author: "James Clear",
  chapters: [
    {
      title: "The Fundamentals",
      content: "Chapter 1: The Surprising Power of Atomic Habits – Habits are the compound interest of self‑improvement; small improvements (just 1 % a day) lead to massive gains over time; results are often delayed (the Plateau of Latent Potential), frustrating early effort without visible change. Systems—not goals—drive sustainable progress; you rise or fall to the level of your systems. Chapter 2: How Your Habits Shape Your Identity (and Vice Versa) – Behaviour change is identity change: the deepest level shift. Focus less on outcomes and more on who you wish to become; every action is a vote for your identity. Choose the person you want to be, then prove it to yourself with small wins, creating a cycle of reinforcing belief and behaviour. Chapter 3: How to Build Better Habits in 4 Simple Steps – All habits follow Cue → Craving → Response → Reward. Use the Four Laws of Behavior Change to build good habits (make it obvious, attractive, easy, satisfying) and invert them to break bad habits (make it invisible, unattractive, difficult, unsatisfying)."
    },
    {
      title: "The 1st Law: Make It Obvious",
      content: "Chapter 4: The Man Who Didn’t Look Right – Habits often operate unconsciously; use awareness tools like the Habit Scorecard and pointing-and-calling to surface hidden patterns. Chapter 5: The Best Way to Start a New Habit – Use implementation intentions (specify when & where) and habit stacking (tie a new habit to an existing one) to make behavior predictable and easier to start. Chapter 6: Motivation Is Overrated; Environment Often Matters More – Visual cues dominate action; design environments that make good habits obvious and cues of bad habits hidden. Chapter 7: The Secret to Self‑Control – Instead of relying on willpower, remove exposure to cues that lead to temptation. Self-control is easier when bad habits simply can’t be triggered."
    },
    {
      title: "The 2nd Law: Make It Attractive",
      content: "Chapter 8: How to Make a Habit Irresistible – The more attractive a habit feels, the easier it is to practice. Use temptation bundling (pair a habit you need with one you want) and harness dopamine-driven anticipation. Chapter 9: The Role of Family & Friends in Shaping Your Habits – We mimic the habits of our groups: the close, the many, and the powerful. Join or create groups where desired habits are the norm. Chapter 10: How to Find and Fix the Causes of Your Bad Habits – Reframe your perspective to highlight downsides of bad habits; introduce motivation rituals before challenging habits to make them more attractive."
    },
    {
      title: "The 3rd Law: Make It Easy",
      content: "Chapter 11: Walk Slowly, but Never Backward – Motion (planning) is not action; true change happens through repetition. Start small and show up consistently. Chapter 12: The Law of Least Effort – Behaviour tends toward the path of least resistance. Remove friction for good habits and add friction for bad ones. Chapter 13: How to Stop Procrastinating by Using the Two‑Minute Rule – Scale new habits down to under two minutes to overcome inertia. Habit formation is easier when you simply “show up.” Chapter 14: How to Make Good Habits Inevitable and Bad Habits Impossible – Use commitment devices and environment design to automate desired behaviors and block undesired ones."
    },
    {
      title: "The 4th Law: Make It Satisfying",
      content: "Chapter 15: The Cardinal Rule of Behavior Change – We’re wired to repeat behaviors that feel immediately satisfying. To stick with habits, link behavior to an immediate reward. Chapter 16: How to Stick with Good Habits Every Day – Habit tracking (“don’t break the chain”) creates visual momentum; adopt the rule ‘never miss twice’ to maintain consistency. Chapter 17: How an Accountability Partner Can Change Everything – Use habit contracts and accountability partners to add immediate social or financial consequences that make bad habits costly and reinforce good ones."
    },
    {
      title: "Advanced Tactics",
      content: "Chapter 18: The Truth About Talent (When Genes Matter and When They Don’t) – Design habits around your natural strengths and interests; experiment with different approaches to align behaviour with personality. Chapter 19: The Goldilocks Rule: How to Stay Motivated in Life and Work – Maintain motivation by working at a level just beyond your current ability (~4 % harder). This keeps tasks in the zone of mastery and triggers flow. Chapter 20: The Downside of Creating Good Habits – Habits can create blind spots and rigidity. Periodic review and reflection keep systems adaptive and prevent stagnation."
    }
  ]
        },
        {
            id: 2,
            title: "Deep Work",
            author: "Cal Newport",
            chapters: [
                { title: "The Deep Work Hypothesis", content: "The ability to perform deep work is becoming increasingly rare at the exact same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive." },
            ]
        }
    ]);
    const [selectedBook, setSelectedBook] = useState(null);

    if (selectedBook) {
        return (
            <div>
                <button onClick={() => setSelectedBook(null)} className="mb-4 text-sm font-semibold">&larr; Back to library</button>
                <h1 className="text-4xl font-bold">{selectedBook.title}</h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">{selectedBook.author}</p>
                <div className="space-y-6">
                    {selectedBook.chapters.map(chapter => (
                        <div key={chapter.title}>
                            <h3 className="text-2xl font-semibold mb-2">{chapter.title}</h3>
                            <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{chapter.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Library</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map(book => (
                    <div key={book.id} onClick={() => setSelectedBook(book)} className="cursor-pointer group">
                        <div className="bg-neutral-300 dark:bg-neutral-800 h-64 rounded-lg flex items-center justify-center p-4 text-center font-bold text-black dark:text-white transition-transform group-hover:scale-105">
                            {book.title}
                        </div>
                        <h3 className="font-semibold mt-2">{book.title}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{book.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 6. Journal
const JournalView = ({ userId }) => {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, `users/${userId}/journal`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sortedEntries = snapshot.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
            setEntries(sortedEntries);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleSaveEntry = async () => {
        if (!newEntry) return;
        await addDoc(collection(db, `users/${userId}/journal`), {
            content: newEntry,
            createdAt: new Date(),
        });
        setNewEntry('');
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Journal</h1>
            <div className="mb-8">
                <textarea 
                    value={newEntry}
                    onChange={e => setNewEntry(e.target.value)}
                    placeholder="How did today go?"
                    className="w-full h-40 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
                ></textarea>
                <button onClick={handleSaveEntry} className="mt-4 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg">Save Entry</button>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Past Entries</h2>
                <div className="space-y-4">
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                {entry.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="whitespace-pre-wrap">{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main Dashboard Page Component ---

export default function DashboardPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
    const [activeView, setActiveView] = useState('plan');
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarCollapsed(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setAuthReady(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const renderView = () => {
        if (!authReady) return <div className="text-center p-10">Authenticating...</div>;
        if (!currentUser) return <div className="text-center p-10">No user is signed in. Please log in to continue.</div>;

        switch (activeView) {
            case 'plan': return <PlanView userId={currentUser.uid} />;
            case 'habits': return <HabitsView userId={currentUser.uid} />;
            case 'todos': return <TodosView userId={currentUser.uid} />;
            case 'analytics': return <AnalyticsView userId={currentUser.uid} />;
            case 'library': return <LibraryView />;
            case 'journal': return <JournalView userId={currentUser.uid} />;
            default: return <PlanView userId={currentUser.uid} />;
        }
    };

    const navItems = [
        { id: 'plan', label: 'My Plan', icon: Target },
        { id: 'habits', label: 'Habits', icon: Repeat },
        { id: 'todos', label: 'To-Do List', icon: CheckSquare },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'library', label: 'Library', icon: Library },
        { id: 'journal', label: 'Journal', icon: BookOpen },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white font-sans relative overflow-hidden">
            <aside className={`flex flex-col justify-between bg-neutral-100 dark:bg-neutral-900 p-4 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                <div>
                    <div className="flex items-center gap-2 mb-10 h-8">
                        <div className="bg-black dark:bg-white rounded p-1">
                          <Target className="text-white dark:text-black" />
                        </div>
                        {!isSidebarCollapsed && <h1 className="text-xl font-bold">Quorith</h1>}
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${activeView === item.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
                            >
                                <item.icon size={20} />
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    <button onClick={toggleTheme} className="flex items-center w-full gap-4 p-3 mb-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        {!isSidebarCollapsed && <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>}
                    </button>
                    <button onClick={() => auth.signOut()} className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                        <LogOut size={20} />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="flex items-center w-full gap-4 p-3 mt-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                        {isSidebarCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                        {!isSidebarCollapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
}
