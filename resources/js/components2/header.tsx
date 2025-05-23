// resources/js/components2/header.tsx
import { Link } from '@inertiajs/react';
import Navbar from './navbar';
import SearchBar from './searchbar';

export default function MainHeader() {
    return (
        <header className="relative flex h-screen flex-col bg-[url('/bg-home.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Navbar inside the header */}
            <Navbar />

            <div className="relative z-10 ml-4 flex h-full flex-col items-start justify-center px-6 text-white md:ml-20 md:px-16">
                <h1 className="text-5xl leading-tight font-bold md:text-7xl">
                    Your Comfort,
                    <br />
                    Our Commitment.
                </h1>

                {/* Button */}
                <div className="mt-6">
                    <Link href="/booking" className="rounded-md bg-black/60 px-6 py-3 text-lg font-medium text-white transition hover:bg-black/70">
                        Book Now
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-20 left-[23%] z-20 w-full max-w-4xl -translate-x-[23%] transform">
                <SearchBar />
            </div>
        </header>
    );
}
