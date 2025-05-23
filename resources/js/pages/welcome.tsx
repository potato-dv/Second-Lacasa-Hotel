import Header from '@/components2/header';
import About from '@/components2/about';
import Property from '@/components2/property';
import Booknow from '@/components2/booknow';
import Footer from '@/components2/footer';
import { type SharedData } from '@/types/index';
import { Head, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="LaCasa Hotel">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            {/* Only renders the Navbar */}
            <Header />
            <About />
            <Property />
            <Booknow />
            <Footer />
        </>
    );
}
