// user-info.tsx
import { UserAvatar } from '@/components/ui/user-avatar';
import { type User } from '@/types';

// Function to truncate email for display
function truncateEmail(email: string, maxLength: number = 25): string {
    if (!email || email.length <= maxLength) return email;
    
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    if (localPart.length > maxLength - domain.length - 4) {
        return `${localPart.slice(0, maxLength - domain.length - 4)}...@${domain}`;
    }
    return email;
}

export function UserInfo({ 
    user, 
    showEmail = false, 
    isCollapsed = false 
}: { 
    user: User; 
    showEmail?: boolean;
    isCollapsed?: boolean;
}) {
    return (
        <div className={`
            flex items-center min-w-0
            ${isCollapsed ? 'justify-center w-auto' : 'gap-3 w-full'}
            transition-all duration-200 ease-in-out
        `}>
            <UserAvatar 
                user={user} 
                size={isCollapsed ? "sm" : "md"} 
                className="flex-shrink-0"
            />
            {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.name}
                    </span>
                    {showEmail && user?.email && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {truncateEmail(user.email)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}