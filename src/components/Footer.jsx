import React from 'react';

// --- Data for Footer Links (Tailored for Quorith) ---
// This data is now based on the features and goals of the Quorith platform.
const footerSections = [
    {
        title: 'Features',
        links: [
            { name: 'AI Daily Goals', href: '#' },
            { name: 'Structured Plansning', href: '#' },
            { name: 'Habit Tracking', href: '#' },
            { name: 'Analytics Dashboard', href: '#' },
            { name: 'Integrations', href: '#' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { name: 'Pricing', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Help Center', href: '#' },
            { name: 'Roadmap', href: '#' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact Us', href: '#' },
        ],
    },
];

// --- SVG Icon Components ---
// These remain the same as they are standard social media icons.
const LinkedInIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.82 3.027 2.053 3.848-.764-.024-1.482-.234-2.11-.583v.06c0 2.256 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.307 3.198 4.342 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602.91-.658 1.7-1.475 2.323-2.41z" />
    </svg>
);

// --- Footer Column Component ---
const FooterLinkColumn = ({ title, links }) => (
    <div>
        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">{title}</h3>
        <ul className="mt-4 space-y-3">
            {links.map((link) => (
                <li key={link.name}>
                    <a href={link.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">
                        {link.name}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default function Footer() {
    return (
        <>
            <style jsx="true" global="true">{`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .footer-bg-text {
                    font-size: 14vw;
                    line-height: 1;
                    font-weight: 900;
                    color: rgba(255, 255, 255, 0.04);
                    user-select: none;
                    text-align: center;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    z-index: 0;
                    white-space: nowrap;
                }
                @media (min-width: 1280px) {
                    .footer-bg-text {
                        font-size: 180px;
                    }
                }
            `}</style>
            <footer className="bg-[black] text-white w-full  rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="footer-bg-text" aria-hidden="true">
                Quorith
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2">
                    {/* Updated copy to match Quorith's mission */}
                    <h3 className="text-lg font-semibold text-white mb-4">Start Your Intentional Growth</h3>
                    <p className="text-gray-400 mb-5 text-sm max-w-sm">
                        Receive insights on personal growth, productivity, and updates from the Quorith team.
                    </p>
                    <form className="flex items-center w-full max-w-sm">
                        <input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-l-md px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-r-md px-5 py-2.5 transition duration-200"
                        >
                            Join
                        </button>
                    </form>
                    <div className="flex items-center space-x-5 mt-8">
                        <a href="#" className="text-gray-400 hover:text-white transition duration-200" aria-label="LinkedIn"><LinkedInIcon /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition duration-200" aria-label="Twitter"><TwitterIcon /></a>
                    </div>
                </div>
                
                {/* Dynamically creating columns from the new data structure */}
                {footerSections.map((section) => (
                    <FooterLinkColumn key={section.title} title={section.title} links={section.links} />
                ))}
            </div>

            <div className="relative z-10 mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Quorith, Inc. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Privacy Policy</a>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Terms of Service</a>
                </div>
            </div>
        </footer>
        </>
    );
}
