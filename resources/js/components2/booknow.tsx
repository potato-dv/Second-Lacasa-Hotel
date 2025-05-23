import { Link } from '@inertiajs/react';

export default function BookingCTA() {
    return (
        <section className="relative w-full">
            {/* Dark overlay on background image */}
            <div className="relative h-96 w-full overflow-hidden">
                {/* Background Image */}
                <img src="/images/amenities/design3.jpg" alt="Hotel Interior" className="h-full w-full object-cover brightness-50" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    {/* Main heading */}
                    <h2 className="mb-6 max-w-3xl text-4xl font-medium text-white md:text-4xl">
                        You deserve a better goddamn stay—Better Call Us, and we'll make sure it happens.
                    </h2>

                    {/* Contact information */}
                    <p className="mb-8 text-white">Call Us On +63 912 345 6789</p>

                    {/* CTA Button */}
                    <Link
                        href="/booking"
                        className="inline-flex items-center bg-[#DAA520] px-6 py-3 text-white transition duration-300 hover:bg-[#8B6514]"
                    >
                        Book Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
