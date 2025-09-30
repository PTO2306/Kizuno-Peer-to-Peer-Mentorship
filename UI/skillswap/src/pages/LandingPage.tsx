// pages/LandingPage.tsx
import React from 'react';

const LandingPage: React.FC = () => {
return (
    <div className="min-h-screen flex flex-col">
    {/* Hero */}
    <section className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Skill Jam
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-xl">
        Bringing communities together through skills
        </p>
        <button className="px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
        Login
        </button>
    </section>

    {/* Problem + Solution + Features */}
    <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
        <p className="text-gray-600 mb-8">
        So many of us have transferable skills and so many of us want to learn something new,
        but we're tired of swimming through the ocean of online courses 
        void of one of the most important ingredients when it comes to teaching and learning - human connection.
        </p>
        <h2 className="text-2xl font-semibold mb-4">The Solution</h2>
        <p className="text-gray-600 mb-8">
        Skill Jam brings a new way to mentor or be mentored through scheduled learning circles and 1-on-1 sessions. 
        It puts community and connection back into something that makes us inherently human - to teach and to learn.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="text-gray-600">
        <ul className="list-disc list-inside">
            <li><b>Automated scheduling:</b> When you join or host a session it automatically slots into your Google Calendar</li>
            <li><b>Leaderboard:</b> To show off some of the best teachers</li>
            <li><b>Full control:</b> You're able to chat with whomever you like to schedule whatever session you like</li>
            <li><b>... it's free to join and explore!</b></li>
        </ul>
        </div>
    </section>

    {/* Call to Action */}
    <footer className="py-12 text-center bg-gray-50">
        <p className="mb-4 text-lg font-medium">Ready to find a community that loves that thing that you love right now?</p>
        <button className="px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
        Sign Up
        </button>
    </footer>
    </div>
);
}


export default LandingPage;