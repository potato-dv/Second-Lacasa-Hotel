// resources/js/components3/navbar.tsx
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Get auth user from Inertia page props
    const { auth } = usePage().props as any;
    const user = auth?.user as User | undefined;
    const isAuthenticated = !!user;

    return (
        <nav className="bg-white border-b border-gray-300 text-gray-800 w-full mb-3">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img src="/android-chrome-512x512.png" alt="Hotel Logo" className="h-10 w-10" />
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            <i className={menuOpen ? 'ri-close-line text-2xl' : 'ri-menu-line text-2xl'}></i>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        {/* Auth Buttons - Show based on authentication status */}
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <div className="flex items-center cursor-pointer rounded-lg bg-gray-100 px-3 py-2 transition duration-300 hover:bg-gray-200">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white mr-2 overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <i className="ri-user-line text-sm text-black"></i>
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                        <i className="ri-arrow-down-s-line ml-2 text-gray-500"></i>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <UserMenuContent user={user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-medium text-gray-700 transition duration-300 ease-in-out hover:text-[#8B6514] mr-4">
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-[#8B6514] px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-[#A07518]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden py-3 px-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-2">
                        {/* Mobile Auth Menu */}
                        {isAuthenticated && user ? (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 px-2 py-2">
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <i className="ri-user-line text-sm text-gray-800"></i>
                                        )}
                                    </div>
                                </div>
                                <Link href={route('dashboard')} className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                                    <i className="ri-dashboard-line mr-2"></i>
                                    Dashboard
                                </Link>
                                <Link href={route('profile.edit')} className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                                    <i className="ri-settings-3-line mr-2"></i>
                                    Settings
                                </Link>
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="w-full flex items-center px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                                >
                                    <i className="ri-logout-box-line mr-2"></i>
                                    Sign out
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link href={route('login')} className="flex items-center justify-center px-2 py-2 bg-[#8B6514] text-white rounded-md hover:bg-[#A07518]">
                                    <i className="ri-login-box-line mr-2"></i>
                                    Log In
                                </Link>
                                <Link href={route('register')} className="flex items-center justify-center px-2 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                                    <i className="ri-user-add-line mr-2"></i>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}