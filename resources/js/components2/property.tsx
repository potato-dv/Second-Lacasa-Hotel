import React, { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'remixicon/fonts/remixicon.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Types for properties
interface PropertyImage {
    id: number;
    src: string;
    title: string;
    subtitle?: string;
    description: string;
    features: {
        text: string;
        icon: string;
    }[];
}

interface PropertyGalleryProps {
    className?: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ className = '' }) => {
    const [activeRoomIndex, setActiveRoomIndex] = useState(0);
    const [activeAmenityIndex, setActiveAmenityIndex] = useState(0);
    const [animateRoomText, setAnimateRoomText] = useState(false);
    const [animateAmenityText, setAnimateAmenityText] = useState(false);

    // Sample property data with enhanced descriptions and icons
    const roomsData = [
        {
            id: 1,
            src: '/images/rooms/dlxrm11.jpg',
            title: 'Deluxe Room',
            subtitle: 'Elegance & Comfort',
            description:
                'Step into a world of refined luxury with our Deluxe Room. The spacious layout welcomes you with premium furnishings and warm tones, creating a sanctuary of relaxation after a day of exploration or business.',
            features: [
                { text: 'King-size bed', icon: 'ri-hotel-bed-line' },
                { text: 'Free Wi-Fi', icon: 'ri-wifi-line' },
                { text: 'Mini-bar', icon: 'ri-goblet-line' },
                { text: 'Room service', icon: 'ri-service-line' },
            ],
        },
        {
            id: 2,
            src: '/images/rooms/dlxrm12.jpg',
            title: 'Deluxe Room',
            subtitle: 'Sophisticated Living',
            description:
                'Our Deluxe Room offers a perfect blend of style and comfort with floor-to-ceiling windows that bathe the space in natural light while providing breathtaking views of the surrounding landscape.',
            features: [
                { text: 'Premium bedding', icon: 'ri-shirt-line' },
                { text: 'Smart TV', icon: 'ri-tv-2-line' },
                { text: 'Rainfall shower', icon: 'ri-showers-line' },
                { text: 'Complimentary breakfast', icon: 'ri-restaurant-line' },
            ],
        },
        {
            id: 3,
            src: '/images/rooms/dlxrm21.jpg',
            title: 'Deluxe Room',
            subtitle: 'Modern Retreat',
            description:
                'This Deluxe Room features contemporary design elements paired with thoughtful amenities. The plush bedding and ambient lighting create an atmosphere of tranquility and indulgence.',
            features: [
                { text: 'Workspace', icon: 'ri-computer-line' },
                { text: 'Climate control', icon: 'ri-temp-hot-line' },
                { text: 'In-room safe', icon: 'ri-safe-2-line' },
                { text: 'Evening turndown service', icon: 'ri-moon-line' },
            ],
        },
        {
            id: 4,
            src: '/images/rooms/stdrm11.jpg',
            title: 'Standard Room',
            subtitle: 'Comfortable Simplicity',
            description:
                'Our Standard Room delivers essential comfort without compromise. Carefully designed to maximize space and functionality, it provides everything you need for a relaxing and productive stay.',
            features: [
                { text: 'Queen-size bed', icon: 'ri-hotel-bed-line' },
                { text: 'Free Wi-Fi', icon: 'ri-wifi-line' },
                { text: 'Work desk', icon: 'ri-macbook-line' },
                { text: 'Daily housekeeping', icon: 'ri-team-line' },
            ],
        },
        {
            id: 5,
            src: '/images/rooms/stdrm12.jpg',
            title: 'Standard Room',
            subtitle: 'Practical Elegance',
            description:
                'Experience the perfect balance of practicality and style in our Standard Room. The thoughtful layout and quality furnishings ensure both comfort and convenience throughout your stay.',
            features: [
                { text: 'Cozy seating area', icon: 'ri-sofa-line' },
                { text: 'Cable TV', icon: 'ri-tv-line' },
                { text: 'Coffee maker', icon: 'ri-cup-line' },
                { text: 'Private bathroom', icon: 'ri-showers-line' },
            ],
        },
    ];

    const amenitiesData = [
        {
            id: 6,
            src: '/images/amenities/hotelacasa.jpg',
            title: 'LaCasa Hotel',
            subtitle: 'Your Home Away From Home',
            description:
                'Welcome to LaCasa Hotel, where luxury meets comfort. Our stunning architecture and prime location provide the perfect setting for an unforgettable stay, whether for business or leisure.',
            features: [
                { text: '24/7 reception', icon: 'ri-customer-service-2-line' },
                { text: 'Concierge service', icon: 'ri-user-star-line' },
                { text: 'Valet parking', icon: 'ri-parking-line' },
                { text: 'Airport shuttle', icon: 'ri-bus-line' },
            ],
        },
        {
            id: 7,
            src: '/images/amenities/lobby.jpg',
            title: 'Grand Lobby',
            subtitle: 'First Impressions Matter',
            description:
                "Our spacious lobby welcomes you with elegant décor, comfortable seating areas, and attentive staff. It's the perfect place to meet friends or colleagues, or simply unwind with a book from our library.",
            features: [
                { text: 'Lounge area', icon: 'ri-sofa-line' },
                { text: 'Concierge desk', icon: 'ri-information-line' },
                { text: 'Business center', icon: 'ri-briefcase-line' },
                { text: 'Free Wi-Fi', icon: 'ri-wifi-line' },
            ],
        },
        {
            id: 8,
            src: '/images/amenities/way.jpg',
            title: 'Hotel Walkway',
            subtitle: 'Journey Through Elegance',
            description:
                'Stroll through our beautifully designed walkways connecting various parts of the hotel. The subtle lighting and artistic elements create an atmosphere of sophistication and tranquility.',
            features: [
                { text: 'Wheelchair accessible', icon: 'ri-wheelchair-line' },
                { text: 'Art displays', icon: 'ri-gallery-line' },
                { text: 'Garden views', icon: 'ri-plant-line' },
                { text: 'Security monitored', icon: 'ri-shield-check-line' },
            ],
        },
    ];

    // Handle slide change and trigger animations
    const handleRoomSlideChange = (swiper: SwiperType) => {
        setAnimateRoomText(false);
        setTimeout(() => {
            setActiveRoomIndex(swiper.realIndex);
            setAnimateRoomText(true);
        }, 300);
    };

    const handleAmenitySlideChange = (swiper: SwiperType) => {
        setAnimateAmenityText(false);
        setTimeout(() => {
            setActiveAmenityIndex(swiper.realIndex);
            setAnimateAmenityText(true);
        }, 300);
    };

    // Initial animation on component mount
    useEffect(() => {
        setAnimateRoomText(true);
        setAnimateAmenityText(true);
    }, []);

    return (
        <div id="room" className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${className}`}>
            {/* Rooms Section */}
            <div className="mb-20 flex flex-col gap-8 lg:flex-row">
                {/* Left: Room Slider */}
                <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl lg:w-1/2">
                    <Swiper
                        modules={[Navigation, EffectFade, Autoplay]}
                        effect="slide"
                        spaceBetween={10}
                        speed={800}
                        loop={true}
                        navigation={{
                            prevEl: '.rooms-prev-button',
                            nextEl: '.rooms-next-button',
                        }}
                        autoplay={{
                            delay: 7000,
                            disableOnInteraction: false,
                        }}
                        onSlideChange={handleRoomSlideChange}
                        className="h-full w-full"
                    >
                        {roomsData.map((room) => (
                            <SwiperSlide key={room.id}>
                                <div className="relative h-full w-full overflow-hidden rounded-lg">
                                    <img
                                        src={room.src}
                                        alt={room.title}
                                        className="h-full w-full rounded-lg object-cover transition-transform duration-800 ease-in-out"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-b from-transparent to-black/70 p-8">
                                        <h2 className="text-4xl leading-tight font-semibold text-white md:text-5xl">{room.title}</h2>
                                        {room.subtitle && (
                                            <h3 className="text-2xl leading-tight font-light text-white/90 md:text-3xl">{room.subtitle}</h3>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation arrows */}
                    <button
                        className="rooms-prev-button absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/40"
                        aria-label="Previous room"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="rooms-next-button absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/40"
                        aria-label="Next room"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Right: Room Description */}
                <div className="flex h-[500px] w-full flex-col justify-between rounded-lg bg-white/5 p-8 shadow-sm lg:w-1/2">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold text-[#8B6514] md:text-4xl">Our Luxurious Accommodations</h2>

                        <div
                            className={`transition-all duration-500 ease-in-out ${
                                animateRoomText ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                            }`}
                        >
                            <h3 className="mb-3 text-2xl font-semibold text-gray-800">{roomsData[activeRoomIndex].title}</h3>
                            <h4 className="mb-4 text-xl font-medium text-[#8B6514]">{roomsData[activeRoomIndex].subtitle}</h4>

                            <p className="mb-6 leading-relaxed text-gray-700">{roomsData[activeRoomIndex].description}</p>

                            <div className="mb-6">
                                <h5 className="mb-4 text-lg font-medium text-gray-800">Room Features:</h5>
                                <ul className="grid grid-cols-2 gap-4">
                                    {roomsData[activeRoomIndex].features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <i className={`${feature.icon} mr-3 text-xl text-[#8B6514]`}></i>
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* <button className="mt-4 bg-[#8B6514] text-white px-6 py-3 rounded-md hover:bg-[#6d4e10] transition-colors self-start flex items-center">
            <i className="ri-calendar-check-line mr-2"></i>
            Book This Room
          </button> */}
                </div>
            </div>

            {/* Amenities Section */}
            <div className="mt-16 flex flex-col-reverse gap-8 lg:flex-row">
                {/* Left: Amenities Description */}
                <div className="flex h-[500px] w-full flex-col justify-between rounded-lg bg-white/5 p-8 shadow-sm lg:w-1/2">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold text-[#8B6514] md:text-4xl">Hotel Amenities & Facilities</h2>

                        <div
                            className={`transition-all duration-500 ease-in-out ${
                                animateAmenityText ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                            }`}
                        >
                            <h3 className="mb-3 text-2xl font-semibold text-gray-800">{amenitiesData[activeAmenityIndex].title}</h3>
                            <h4 className="mb-4 text-xl font-medium text-[#8B6514]">{amenitiesData[activeAmenityIndex].subtitle}</h4>

                            <p className="mb-6 leading-relaxed text-gray-700">{amenitiesData[activeAmenityIndex].description}</p>

                            <div className="mb-6">
                                <h5 className="mb-4 text-lg font-medium text-gray-800">Highlights:</h5>
                                <ul className="grid grid-cols-2 gap-4">
                                    {amenitiesData[activeAmenityIndex].features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <i className={`${feature.icon} mr-3 text-xl text-[#8B6514]`}></i>
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* <button className="mt-4 bg-[#8B6514] text-white px-6 py-3 rounded-md hover:bg-[#6d4e10] transition-colors self-start flex items-center">
            <i className="ri-compass-discover-line mr-2"></i>
            Explore More
          </button> */}
                </div>

                {/* Right: Amenities Slider */}
                <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl lg:w-1/2">
                    <Swiper
                        modules={[Navigation, EffectFade, Autoplay]}
                        effect="slide"
                        spaceBetween={10}
                        speed={800}
                        loop={true}
                        navigation={{
                            prevEl: '.amenities-prev-button',
                            nextEl: '.amenities-next-button',
                        }}
                        autoplay={{
                            delay: 7000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onSlideChange={handleAmenitySlideChange}
                        className="h-full w-full"
                    >
                        {amenitiesData.map((amenity) => (
                            <SwiperSlide key={amenity.id}>
                                <div className="relative h-full w-full overflow-hidden rounded-lg">
                                    <img
                                        src={amenity.src}
                                        alt={amenity.title}
                                        className="h-full w-full rounded-lg object-cover transition-transform duration-800 ease-in-out"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-b from-transparent to-black/70 p-8">
                                        <h2 className="text-4xl leading-tight font-bold text-white md:text-5xl">{amenity.title}</h2>
                                        {amenity.subtitle && (
                                            <h3 className="text-2xl leading-tight font-light text-white/90 md:text-3xl">{amenity.subtitle}</h3>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation arrows */}
                    <button
                        className="amenities-prev-button absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/40"
                        aria-label="Previous amenity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="amenities-next-button absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/40"
                        aria-label="Next amenity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyGallery;
