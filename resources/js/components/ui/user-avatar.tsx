import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { useEffect, useState } from 'react';

interface UserAvatarProps {
    user: User;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
    const getInitials = useInitials();
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Function to clean the avatar URL and proxy it if it's a Google profile picture
    const getAvatarUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;
        
        // Remove any non-printable characters and trim whitespace
        const cleaned = url.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        
        // If it's a Google profile picture, use our proxy
        if (cleaned.includes('googleusercontent.com')) {
            // Try to get a larger size (s96-c -> s192-c)
            const largerUrl = cleaned.replace('s96-c', 's192-c');
            // Add a cache-busting parameter to force a fresh request
            return `/avatar-proxy?url=${encodeURIComponent(largerUrl)}&_=${retryCount}`;
        }
        
        return cleaned;
    };

    const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : undefined;

    // Reset states when user changes
    useEffect(() => {
        setImageError(false);
        setRetryCount(0);
    }, [user?.avatar]);

    const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error('Failed to load avatar:', avatarUrl);
        setImageError(true);
        e.currentTarget.style.display = 'none';
        
        // Retry up to 3 times
        if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setImageError(false);
        }
    };

    // Google-style size classes with better proportions
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12'
    };

    // Google-style fallback text sizes
    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    // Generate a consistent color based on user's name
    const getBackgroundColor = (name: string) => {
        if (!name) return 'bg-blue-500';
        
        // Google's material design color palette
        const colors = [
            'bg-red-500',
            'bg-pink-500', 
            'bg-purple-500',
            'bg-indigo-500',
            'bg-blue-500',
            'bg-cyan-500',
            'bg-teal-500',
            'bg-green-500',
            'bg-lime-500',
            'bg-yellow-500',
            'bg-orange-500',
            'bg-brown-500'
        ];
        
        // Simple hash function to get consistent color
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Avatar className={`${sizeClasses[size]} rounded-full border-0 shadow-sm ring-2 ring-white/20 transition-transform hover:scale-105 flex-shrink-0 ${className || ''}`}>
            {avatarUrl && !imageError ? (
                <AvatarImage
                    src={avatarUrl}
                    alt={user.name || 'User avatar'}
                    onError={handleImageError}
                    className="h-full w-full object-cover"
                />
            ) : null}
            <AvatarFallback 
                className={`
                    ${getBackgroundColor(user?.name || '')} 
                    ${textSizeClasses[size]}
                    rounded-full 
                    font-medium 
                    text-white 
                    flex 
                    items-center 
                    justify-center
                    border-0
                `}
            >
                {getInitials(user?.name || '')}
            </AvatarFallback>
        </Avatar>
    );
}