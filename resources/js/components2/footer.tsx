import { Link } from '@inertiajs/react';
import React from 'react';
import 'remixicon/fonts/remixicon.css';

interface SocialLink {
    icon: string;
    url: string;
    label: string;
}

interface FooterLink {
    text: string;
    url: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
    // Social media links
    const socialLinks: SocialLink[] = [
        { icon: 'ri-facebook-fill', url: 'https://facebook.com', label: 'Facebook' },
        { icon: 'ri-instagram-line', url: 'https://instagram.com', label: 'Instagram' },
        { icon: 'ri-twitter-x-line', url: 'https://twitter.com', label: 'Twitter' },
        { icon: 'ri-linkedin-fill', url: 'https://linkedin.com', label: 'LinkedIn' },
    ];

    // Footer sections with links
    const footerSections: FooterSection[] = [
        {
            title: 'About',
            links: [
                { text: 'Our Story', url: '/about' },
                { text: 'Team', url: '/team' },
                { text: 'Careers', url: '/careers' },
                { text: 'Press', url: '/press' },
            ],
        },
        {
            title: 'Services',
            links: [
                { text: 'Rooms & Suites', url: '/rooms' },
                { text: 'Restaurant', url: '/restaurant' },
                { text: 'Spa & Wellness', url: '/spa' },
                { text: 'Events', url: '/events' },
            ],
        },
        {
            title: 'Support',
            links: [
                { text: 'Help Center', url: '/help' },
                { text: 'FAQs', url: '/faqs' },
                { text: 'Contact Us', url: '/contact' },
                { text: 'Policies', url: '/policies' },
            ],
        },
    ];

    return (
        <footer className={`bg-white text-white ${className}`}>
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Hotel Info */}
                    <div className="lg:col-span-2">
                        <div className="mb-3">
                            <img src="/android-chrome-512x512.png" alt="LaCasa Hotel" className="h-14 w-auto" />
                        </div>
                        <p className="mb-5 max-w-md text-3xl font-bold text-gray-700">
                            Your Comfort,
                            <br />
                            Our Commitment.
                        </p>

                        {/* Social Media Links */}
                        <div className="grid w-fit grid-cols-2 gap-x-6 gap-y-4">
                            <button
                                onClick={() => window.open('https://facebook.com', '_blank')}
                                className="inline-flex h-[36px] w-[136px] cursor-pointer items-center rounded-full border border-gray-500 bg-white px-5 py-2 transition-all duration-300"
                            >
                                <i className="ri-facebook-fill mr-2 text-lg text-gray-800"></i>
                                <span className="text-sm font-medium text-gray-800">Facebook</span>
                            </button>

                            <button
                                onClick={() => window.open('https://instagram.com', '_blank')}
                                className="inline-flex h-[36px] w-[135px] -ml-4 cursor-pointer items-center rounded-full border border-gray-500 bg-white px-5 py-2 transition-all duration-300"
                            >
                                <i className="ri-instagram-line mr-2 text-lg text-gray-800"></i>
                                <span className="text-sm font-medium text-gray-800">Instagram</span>
                            </button>

                            <button
                                onClick={() => window.open('https://twitter.com', '_blank')}
                                className="inline-flex h-[36px] w-[115px] cursor-pointer items-center rounded-full border border-gray-500 bg-white px-5 py-2 transition-all duration-300"
                            >
                                <i className="ri-twitter-x-line mr-2 text-lg text-gray-800"></i>
                                <span className="text-sm font-medium text-gray-800">Twitter</span>
                            </button>

                            <button
                                onClick={() => window.open('https://linkedin.com', '_blank')}
                                className="inline-flex h-[36px] w-[128px] -ml-9 cursor-pointer items-center rounded-full border border-gray-500 bg-white px-5 py-2 transition-all duration-300"
                            >
                                <i className="ri-linkedin-box-fill mr-2 text-lg text-gray-800"></i>
                                <span className="text-sm font-medium text-gray-800">LinkedIn</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer Navigation Sections */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="mt-5 lg:mt-12">
                            <h3 className="mb-4 text-lg font-semibold text-[#DAA520]">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link href={link.url} className="text-gray-700 transition-colors duration-300 hover:text-gray-500">
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Bar */}
            <div className="border bg-white py-6">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8">
                    <div className="mb-4 flex flex-col items-center space-y-3 md:mb-0 md:flex-row md:space-y-0 md:space-x-6">
                        <div className="flex items-center">
                            <i className="ri-map-pin-line mr-2 text-[#DAA520]"></i>
                            <span className="text-gray-700">Tandang Sora Ave, Kulyat, Philippines</span>
                        </div>
                        <div className="flex items-center">
                            <i className="ri-phone-line mr-2 text-[#DAA520]"></i>
                            <span className="text-gray-700">(221) 33.822.55.32</span>
                        </div>
                        <div className="flex items-center">
                            <i className="ri-mail-line mr-2 text-[#DAA520]"></i>
                            <span className="text-gray-700">lacasahotel@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#DAA520] py-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-between px-4 text-sm text-white sm:px-6 md:flex-row lg:px-8">
                    <div className="mb-2 md:mb-0">© {new Date().getFullYear()} LaCasa Hotel. All rights reserved.</div>
                    <div className="flex space-x-4">
                        <Link href="/terms" className="text-white transition-colors duration-300 hover:text-gray-300">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-white transition-colors duration-300 hover:text-gray-300">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="text-white transition-colors duration-300 hover:text-gray-300">
                            Cookies 
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
