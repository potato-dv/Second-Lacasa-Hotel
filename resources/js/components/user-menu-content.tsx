// UserMenuContent Component
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { Home, LogOut, Settings, LayoutDashboard } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    return (
        <div className="w-64 min-w-0"> {/* Set a fixed width for the dropdown */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="px-2 py-2 min-w-0">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link 
                        className="flex items-center w-full px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                        href={route('home')} 
                        as="button" 
                        prefetch 
                        onClick={cleanup}
                    >
                        <Home className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Welcome Page</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link 
                        className="flex items-center w-full px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                        href={route('dashboard')} 
                        as="button" 
                        prefetch 
                        onClick={cleanup}
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link 
                        className="flex items-center w-full px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" 
                        href={route('profile.edit')} 
                        as="button" 
                        prefetch 
                        onClick={cleanup}
                    >
                        <Settings className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link 
                    className="flex items-center w-full px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400" 
                    method="post" 
                    href={route('logout')} 
                    as="button" 
                    onClick={cleanup}
                >
                    <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Log out</span>
                </Link>
            </DropdownMenuItem>
        </div>
    );
}