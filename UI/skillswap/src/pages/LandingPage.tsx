import { Link } from 'react-router';
import media1 from '../assets/people-removebg-preview.png';
import media2 from '../assets/people_talking-removebg-preview.png';

const LandingPage: React.FC = () => {
return (
<div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-purple-50 relative overflow-hidden">
    {/* Hero */}
    <section className="flex-1 flex items-center justify-center px-6 py-20">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="text-center md:text-left">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent leading-tight">
            Skill Swap
        </h1>
        <span className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
            Learn anything, one conversation at a time
        </span>
        <h2 className="text-xl md:text-2xl text-slate-600 mt-5 mb-12 leading-relaxed">
            Peer-to-peer conversation platform to connect with other people who have experience in what you want to talk about
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
            to="/register"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 text-white text-lg font-medium shadow-lg shadow-violet-500/30 transition hover:from-violet-700 hover:to-purple-800 hover:scale-105"
            >
            Get started
            </Link>
            <Link
            to="/login"
            className="px-8 py-4 rounded-lg border-2 border-violet-300 text-violet-700 text-lg font-medium transition hover:border-violet-400 hover:bg-violet-50 hover:scale-105"
            >
            Log in
            </Link>
        </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
        <div className="relative z-10 hover:scale-105 transition duration-500">
            <img
            src={media2}
            alt="People talking"
            className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 blur-3xl -z-10 scale-110"></div>
        </div>
    </div>
    </section>

    {/* Second Section */}
    <section className="px-6 py-16 bg-white/60 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="order-2 md:order-1 relative">
        <div className="relative z-10 hover:scale-105 transition duration-500">
            <img
            src={media1}
            alt="People connecting"
            className="w-full h-auto max-w-md mx-auto drop-shadow-xl"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-400/20 to-violet-400/20 blur-3xl -z-10 scale-110"></div>
        </div>

        {/* Text */}
        <div className="order-1 md:order-2 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
            Connect with mentors who are passionate about your topic
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Whether you're preparing for an interview, learning a new skill, seeking career advice, or just wanting to chat about an interesting topic — Skill Swap is the perfect platform to connect with someone
        </p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
            Practice interviews
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Learn skills
            </span>
            <span className="px-4 py-2 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm font-medium">
            Career advice
            </span>
        </div>
        </div>
    </div>
    </section>

    {/* Footer */}
    <footer className="px-6 py-14 bg-slate-800">
    <div className="max-w-6xl mx-auto text-center">
        <div className="text-lg text-slate-200 font-medium mb-3">
        Create a listing about your topic, or browse listings from other people → Connect with others via the built in chat → meet for coffee!✨
        </div>
    </div>
    </footer>
</div>
);
};

export default LandingPage;
