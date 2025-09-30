// pages/LandingPage.tsx
import React from 'react';
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router';

const LandingPage: React.FC = () => {
return (
    <div className='min-h-screen flex flex-col'>
    {/* Hero */}
    <section className='flex-1 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-indigo-50 to-white'>
        <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-indigo-800 text-sm'>
        ✨ Real people. Real sessions.
        </div>
        <h1 className='text-4xl md:text-6xl font-extrabold mb-3'>
        <span className='bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent'>
            Skill Jam
        </span>
        </h1>
        <p className='text-lg md:text-xl text-gray-600 mb-6 max-w-xl leading-relaxed'>
        Bringing communities together through skills
        </p>
        <Button 
        className='px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition'
        component={RouterLink}
        to='/login'
        >
            Login
        </Button>
    </section>

    {/* Problem + Solution + Features */}
    <section className='py-16 px-6 max-w-5xl mx-auto'>
        <div className='mb-6 flex items-start gap-3'>
        <span className='mt-1 h-8 w-1 rounded-full bg-indigo-500/70' />
        <h2 className='text-2xl md:text-3xl font-extrabold leading-tight'>
            Tired of swimming through the ocean of online courses{" "}
            <span className='bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent'>
            void of human connection?
            </span>
        </h2>
        </div>
        <p className='text-gray-600 mb-10 max-w-3xl'>
        We put community and connection back into learning — real sessions with real people, scheduled and supported.
        </p>

        <div className='grid md:grid-cols-2 gap-6'>
        <div className='relative rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-7'>
            <div className='absolute left-0 top-6 h-8 w-1 rounded-r bg-indigo-500/80' />
            <div className='mb-2 text-sm uppercase tracking-wide text-indigo-600 flex items-center gap-2'>
            <span>How it works</span>
            </div>
            <h3 className='text-xl font-semibold mb-3'>The Solution</h3>
            <div className='text-gray-700 max-w-prose leading-relaxed space-y-2'>
            <p><b>Real people, real sessions.</b> Learn and mentor in scheduled circles and 1‑on‑1s.</p>
            <ul className='list-disc pl-5 space-y-1'>
                <li>Schedule sessions with calendar support</li>
                <li>Join learning circles or 1‑on‑1 mentoring</li>
                <li>Grow with feedback and community</li>
            </ul>
            </div>
        </div>
        <div className='rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6'>
            <h3 className='text-xl font-semibold mb-3'>Features</h3>
            <ul className='list-disc pl-5 space-y-2 text-gray-700'>
            <li><b>Automated scheduling:</b> Sessions slot straight into your Google Calendar</li>
            <li><b>Leaderboard:</b> Celebrate outstanding mentors</li>
            <li><b>Full control:</b> Chat, pick your mentor, and schedule what you want</li>
            <li><b>Free to explore:</b> Jump in and browse communities</li>
            </ul>
        </div>
        </div>
    </section>

    {/* Call to Action */}
    <footer className='py-14 text-center bg-gradient-to-r from-indigo-600 to-fuchsia-600'>
        <p className='mb-5 text-lg md:text-xl font-semibold text-white'>
        Ready to find a community that loves that thing you love?
        </p>
        <Button 
        className='px-6 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 transition shadow-sm'
        component={RouterLink}
        to='/register'
        >
        Get Started — It’s Free
        </Button>
    </footer>
    </div>
);
}


export default LandingPage;