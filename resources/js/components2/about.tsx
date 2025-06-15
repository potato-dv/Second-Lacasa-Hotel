import { motion, useInView, Variants } from 'framer-motion';
import React, { useRef } from 'react';
import { RiHotelLine, RiLayoutMasonryLine, RiShieldCheckLine, RiUserStarLine } from 'react-icons/ri';

/**
 * AnimatedFadeIn Component
 * Wraps children in a fade-in animation triggered when component comes into view
 */
const AnimatedFadeIn: React.FC<{
    children: React.ReactNode;
    delay?: number;
    fromDirection?: 'left' | 'right' | 'bottom';
}> = ({ children, delay = 0, fromDirection = 'bottom' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: false,
        amount: 0.2,
    });

    // Define animation variants to avoid TypeScript errors
    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: fromDirection === 'left' ? -40 : fromDirection === 'right' ? 40 : 0,
            y: fromDirection === 'bottom' ? 40 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: delay,
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Service item type definition with icon
 */
interface ServiceItem {
    title: string;
    desc: string;
    icon: React.ElementType;
}

/**
 * Stats item type definition
 */
interface StatItem {
    value: string;
    label: string;
    hasBorder?: boolean;
}

/**
 * About page component
 */
const About: React.FC = () => {
    // Service items data with specific icons
    const services: ServiceItem[] = [
        {
            title: 'Online Booking System',
            desc: 'Simplified hotel room reservations with real-time availability.',
            icon: RiHotelLine,
        },
        {
            title: 'Guest Management',
            desc: 'Track guest information and history to enhance experiences.',
            icon: RiUserStarLine,
        },
        {
            title: 'Room Customization',
            desc: 'Showcase your rooms with custom layouts and amenities.',
            icon: RiLayoutMasonryLine,
        },
        {
            title: 'Secure Payment Integration',
            desc: 'Guests can make secure online payments through trusted gateways.',
            icon: RiShieldCheckLine,
        },
    ];

    // Stats data
    const stats: StatItem[] = [
        {
            value: '2000+',
            label: 'Bookings Completed',
            hasBorder: true,
        },
        {
            value: '98%',
            label: 'Happy Guests',
            hasBorder: true,
        },
        {
            value: '90%',
            label: 'Repeat Customers',
        },
    ];

    return (
        <section id="about" className="cursor-default bg-white px-4 py-16 text-gray-800 md:px-20">
            <div className="mx-auto max-w-7xl">
                {/* Hotel label above the horizontal layout */}
                <AnimatedFadeIn delay={0.2} fromDirection="bottom">
                    <p className="mb-4 text-left font-serif text-base text-[#8B6514] italic">LaCasa Hotel</p>
                </AnimatedFadeIn>

                {/* Title and description in a flex layout */}
                <div className="mb-16 flex flex-col justify-between md:flex-row md:items-start md:space-x-8">
                    {/* Section title */}
                    <div className="md:w-1/2">
                        <AnimatedFadeIn delay={0.3} fromDirection="left">
                            <h2 className="text-left text-3xl font-bold md:text-4xl lg:text-5xl">
                                <span className="text-gray-700">Where comfort meets convenience.</span>
                            </h2>
                        </AnimatedFadeIn>
                    </div>

                    {/* Section description - left aligned text but positioned on right side */}
                    <div className="mt-5 md:mt-0 md:w-1/2">
                        <AnimatedFadeIn delay={0.4} fromDirection="right">
                            <p className="text-left text-base text-gray-600 md:text-lg">
                                At <span className="font-semibold">LaCasa Hotel</span>, we offer a seamless digital booking experience by delivering
                                high-quality web development services. Our focus is on creating user-friendly platforms to streamline hotel
                                reservations, manage guest experiences, and unlock growth opportunities through smart technology.
                            </p>
                        </AnimatedFadeIn>
                    </div>
                </div>

                {/* Services grid */}
                <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                    {services.map((item, idx) => (
                        <AnimatedFadeIn key={idx} delay={0.3 + 0.15 * idx} fromDirection="bottom">
                            <div className="group flex items-start space-x-4">
                                <div className="text-[#8B6514] transition-all duration-300 group-hover:text-[#6d4e10]">
                                    {React.createElement(item.icon, { size: 28 })}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold md:text-xl">{item.title}</h4>
                                    <p className="text-sm text-gray-600 md:text-base">{item.desc}</p>
                                </div>
                            </div>
                        </AnimatedFadeIn>
                    ))}
                </div>

                {/* Stats section */}
                <div className="mt-20 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                    {stats.map((stat, idx) => (
                        <AnimatedFadeIn key={idx} delay={0.4 + 0.15 * idx} fromDirection="bottom">
                            <div className={stat.hasBorder ? 'border-r-2 border-gray-300 pr-8' : ''}>
                                <h3 className="text-5xl font-bold text-[#8B6514]">{stat.value}</h3>
                                <p className="mt-1 text-sm font-semibold text-gray-600">{stat.label}</p>
                            </div>
                        </AnimatedFadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
