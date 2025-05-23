import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/android-chrome-512x512.png"
            alt="LaCasa Hotel Logo"
            {...props}
        />
    );
}
