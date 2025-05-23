// resources/js/components2/navbar.tsx
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { UserMenuContent } from '@/components/user-menu-content';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Get auth user from Inertia page props
    const { auth } = usePage().props as any;
    const user = auth?.user as User | undefined;
    const isAuthenticated = !!user;

    return (
        <nav className="absolute top-4 left-0 z-50 w-full bg-transparent">
            <div className="mx-auto max-w-8xl px-6 md:px-16">
                <div className="flex items-center justify-between py-3">
                    {/* Logo - Adjusted to fit without space */}
                    <Link href="/" className="flex items-center">
                        <div className="h-15 w-auto">
                            <img 
                                src="/hotel-logo.svg" 
                                alt="LaCasa Logo" 
                                className="h-full w-auto object-contain object-left" 
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden flex-grow justify-center space-x-5 md:flex">
                        <Link href="#home" className="text-lg text-white transition duration-300 ease-in-out hover:text-[#DAA520]">
                            Home
                        </Link>
                        <Link href="#about" className="text-lg text-white transition duration-300 ease-in-out hover:text-[#DAA520]">
                            About
                        </Link>
                        <Link href="#room" className="text-lg text-white transition duration-300 ease-in-out hover:text-[#DAA520]">
                            Room
                        </Link>
                    </div>

                    {/* Auth Buttons - Show based on authentication status */}
                    <div className="hidden items-center space-x-6 md:flex">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <div className="flex items-center cursor-pointer rounded-lg border border-white/20 bg-white/50 px-3 py-2 backdrop-blur-sm transition duration-300 hover:border-white/50">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white mr-2">
                                            <i className="ri-user-line text-sm text-black"></i>
                                        </div>
                                        <span className="font-medium text-white">{user.name}</span>
                                        <i className="ri-arrow-down-s-line ml-2 text-white"></i>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <UserMenuContent user={user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-medium text-white transition duration-300 ease-in-out hover:text-[#DAA520]">
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-sm bg-[#8B6514] px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-white hover:text-[#8B6514]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="block text-2xl text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        <i className={menuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="flex flex-col items-center space-y-4 bg-black/90 py-4 md:hidden">
                    <Link href="#home" className="text-white hover:text-[#DAA520]">
                        Home
                    </Link>
                    <Link href="#about" className="text-white hover:text-[#DAA520]">
                        About
                    </Link>
                    <Link href="#room" className="text-white hover:text-[#DAA520]">
                        Room
                    </Link>
                    
                    {/* Mobile Auth Menu */}
                    {isAuthenticated ? (
                        <>
                            <Link href={route('dashboard')} className="text-white hover:text-[#DAA520]">
                                Dashboard
                            </Link>
                            <Link href={route('profile.edit')} className="text-white hover:text-[#DAA520]">
                                Settings
                            </Link>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="text-white hover:text-[#DAA520]"
                            >
                                Log Out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-white hover:text-[#DAA520]">
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-[#FFD700] px-4 py-2 font-semibold text-black transition hover:bg-[#DAA520]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}