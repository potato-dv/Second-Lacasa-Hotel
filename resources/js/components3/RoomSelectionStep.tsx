// resources/js/components3/RoomSelectionStep.tsx
import React, { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DeluxeRoom, Room, StandardRoom } from '../models/Room';
import { RoomAPI } from '../services/api'; // Import the API service
import { BookingDetails } from '../types';
import { getAvailableRooms } from '../utils/roomUtils'; // Import the utility function

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import custom CSS
import '../../css/custom-swiper.css';
// Import required Swiper modules
import { Navigation, Pagination } from 'swiper/modules';
// Import Remix icons
import {
    RiArrowDownSLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowUpSLine,
    RiGobletLine,
    RiHomeWifiLine,
    RiHotelBedLine,
    RiServiceLine,
    RiShowersLine,
    RiTvLine,
    RiVipCrownLine,
    RiWifiLine,
} from 'react-icons/ri';

interface RoomSelectionStepProps {
    bookingDetails: BookingDetails;
    updateBookingDetails: (updates: Partial<BookingDetails>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

// Define a type for feature items
interface Feature {
    icon: React.ReactNode;
    text: string;
}

// Helper function to get room images based on room type
const getRoomImages = (roomType: string, roomId: string) => {
    // In a real application, you'd fetch these from your backend or have a more sophisticated mapping
    if (roomType === 'Standard') {
        return [`/images/rooms/stdrm11.jpg`, `/images/rooms/stdrm12.jpg`, `/images/rooms/stdbr1.jpg`];
    } else if (roomType === 'Deluxe') {
        return [`/images/rooms/dlxrm11.jpg`, `/images/rooms/dlxrm12.jpg`, `/images/rooms/dlxrm21.jpg`, `/images/rooms/dlxbr1.jpg`];
    }
    return ['/images/rooms/default-room.jpg']; // Default image as fallback
};

const RoomSelectionStep: React.FC<RoomSelectionStepProps> = ({ bookingDetails, updateBookingDetails, nextStep, prevStep }) => {
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const totalGuests = bookingDetails.adults + bookingDetails.children;
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 6;
    // State to track expanded features for each room
    const [expandedFeatures, setExpandedFeatures] = useState<Record<number, boolean>>({});

    // Create a map of swiper refs for each room - use correct Swiper type
    const swiperRefs = useRef<Record<number, SwiperType | null>>({});

    useEffect(() => {
        // Only fetch if we have dates
        if (bookingDetails.checkIn && bookingDetails.checkOut) {
            const fetchRooms = async () => {
                setIsLoading(true);
                setError(null);
            
                try {
                    console.log('Fetching rooms with params:', {
                        checkIn: bookingDetails.checkIn?.toISOString(),
                        checkOut: bookingDetails.checkOut?.toISOString(),
                        adults: bookingDetails.adults,
                        children: bookingDetails.children,
                    });
            
                    // Use the utility function to get available rooms
                    const rooms = await getAvailableRooms(
                        bookingDetails.checkIn,
                        bookingDetails.checkOut,
                        bookingDetails.adults,
                        bookingDetails.children,
                    );
            
                    console.log('Received rooms from API:', rooms);
                    setAvailableRooms(rooms);
                } catch (err) {
                    console.error('Failed to fetch rooms:', err);
                    setError('Failed to load available rooms. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchRooms();
        }

        // Reset to first page when rooms change
        setCurrentPage(1);
        // Reset expanded features when rooms change
        setExpandedFeatures({});
        // Reset swiper refs
        swiperRefs.current = {};
    }, [bookingDetails.checkIn, bookingDetails.checkOut, bookingDetails.adults, bookingDetails.children]);

    const handleSelectRoom = (room: Room) => {
        // Convert Room model to RoomData type for BookingDetails
        const roomData = {
            id: room.id,
            roomNumber: room.roomNumber,
            floor: room.floor,
            price: room.price,
            capacity: room.capacity,
            type: room.type,
            features: room.features
        };
        
        updateBookingDetails({ selectedRoom: roomData });
    };

    const handleContinue = () => {
        if (!bookingDetails.selectedRoom) {
            alert('Please select a room to continue.');
            return;
        }
        nextStep();
    };

    // Function to toggle feature expansion for a specific room
    const toggleFeatures = (roomId: number) => {
        setExpandedFeatures((prev) => ({
            ...prev,
            [roomId]: !prev[roomId],
        }));
    };

    // Calculate pagination
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = availableRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const totalPages = Math.ceil(availableRooms.length / roomsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            // Scroll to top of room listings when changing page
            document.getElementById('rooms-container')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            // Scroll to top of room listings when changing page
            document.getElementById('rooms-container')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper function to render room features based on room type
    const renderRoomFeatures = (room: Room) => {
        let features: Feature[] = [];

        if (room instanceof StandardRoom) {
            features = [
                { icon: <RiHotelBedLine className="text-[#8B6514]" />, text: 'Work desk' },
                { icon: <RiWifiLine className="text-[#8B6514]" />, text: 'Free WiFi' },
                { icon: <RiTvLine className="text-[#8B6514]" />, text: 'Flat-screen TV' },
                { icon: <RiHotelBedLine className="text-[#8B6514]" />, text: 'Coffee maker' },
            ];
        } else if (room instanceof DeluxeRoom) {
            features = [
                { icon: <RiVipCrownLine className="text-[#8B6514]" />, text: 'Premium bedding' },
                { icon: <RiGobletLine className="text-[#8B6514]" />, text: 'Mini bar' },
                { icon: <RiHomeWifiLine className="text-[#8B6514]" />, text: 'Enhanced WiFi' },
                { icon: <RiShowersLine className="text-[#8B6514]" />, text: 'Luxury bathroom' },
                { icon: <RiHotelBedLine className="text-[#8B6514]" />, text: 'Private balcony' },
                { icon: <RiServiceLine className="text-[#8B6514]" />, text: 'Room service' },
                { icon: <RiTvLine className="text-[#8B6514]" />, text: 'Smart TV' },
            ];
        }

        const isExpanded = expandedFeatures[room.id] || false;
        const visibleFeatures = isExpanded ? features : features.slice(0, 2);

        return (
            <div className="space-y-2">
                {visibleFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        {feature.icon}
                        <span className="text-gray-500">{feature.text}</span>
                    </div>
                ))}

                {features.length > 2 && (
                    <button
                        onClick={() => toggleFeatures(room.id)}
                        className="mt-1 flex items-center text-xs font-medium text-[#8B6514] hover:underline"
                    >
                        {isExpanded ? (
                            <>
                                <span>Show less</span>
                                <RiArrowUpSLine className="ml-1" />
                            </>
                        ) : (
                            <>
                                <span>Show more ({features.length - 2} features)</span>
                                <RiArrowDownSLine className="ml-1" />
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    // Render pagination controls
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center rounded-md p-2 ${
                        currentPage === 1 ? 'cursor-not-allowed text-gray-300' : 'text-[#8B6514] hover:bg-amber-50'
                    }`}
                >
                    <RiArrowLeftSLine size={24} />
                </button>
                <div className="text-sm">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center rounded-md p-2 ${
                        currentPage === totalPages ? 'cursor-not-allowed text-gray-300' : 'text-[#8B6514] hover:bg-amber-50'
                    }`}
                >
                    <RiArrowRightSLine size={24} />
                </button>
            </div>
        );
    };

    // Custom function for handling navigation clicks without default browser behavior
    const handleSwiperNavClick = (e: React.MouseEvent, roomId: number, direction: 'prev' | 'next') => {
        // Prevent default browser behavior
        e.preventDefault();
        e.stopPropagation();

        // Make sure we have a swiper instance
        const swiper = swiperRefs.current[roomId];
        if (!swiper) return;

        // Navigate swiper
        if (direction === 'prev') {
            swiper.slidePrev();
        } else {
            swiper.slideNext();
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-2xl pt-6 font-semibold text-gray-900">Step 2: Room Selection</h2>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#8B6514]"></div>
                </div>
            ) : error ? (
                <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
            ) : availableRooms.length === 0 ? (
                <div className="rounded-md bg-gray-100 p-8 text-center">
                    <p className="mb-2 text-gray-600">No available rooms found for {totalGuests} guests.</p>
                    <p className="text-gray-600">Please adjust your stay details or check your connection to the database.</p>
                </div>
            ) : (
                <>
                    <div id="rooms-container" className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentRooms.map((room) => {
                            const roomImages = getRoomImages(room.type, String(room.id));

                            return (
                                <div
                                    key={room.id}
                                    className={`overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md ${
                                        bookingDetails.selectedRoom?.id === room.id ? 'bg-black/10' : ''
                                    }`}
                                >
                                    {/* Swiper for room images with custom navigation */}
                                    <div className="relative h-48 w-full">
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            pagination={{
                                                clickable: true,
                                                bulletClass: 'swiper-pagination-bullet',
                                                bulletActiveClass: 'swiper-pagination-bullet-active',
                                            }}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            className="room-swiper h-full w-full"
                                            loop={true} // Enable loop mode
                                            onSwiper={(swiper) => {
                                                // Store the swiper instance for this specific room
                                                swiperRefs.current[room.id] = swiper;
                                            }}
                                        >
                                            {roomImages.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={image}
                                                        alt={`${room.type} Room ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            // Fallback to placeholder if image can't be loaded
                                                            (e.target as HTMLImageElement).src = '/api/placeholder/400/320';
                                                        }}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {/* Custom navigation buttons with circular transparent design */}
                                        <button
                                            className="custom-swiper-button-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/30 p-2 text-gray-600 transition hover:bg-white/60 hover:text-black"
                                            onClick={(e) => handleSwiperNavClick(e, room.id, 'prev')}
                                            type="button"
                                        >
                                            <RiArrowLeftSLine size={19} />
                                        </button>

                                        <button
                                            className="custom-swiper-button-next absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/30 p-2 text-gray-600 transition hover:bg-white/60 hover:text-black"
                                            onClick={(e) => handleSwiperNavClick(e, room.id, 'next')}
                                            type="button"
                                        >
                                            <RiArrowRightSLine size={19} />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-3 text-lg font-medium text-[#8B6514]">{room.type} Room</div>
                                        <div className="mb-2 text-sm">
                                            <span className="inline-block rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700">
                                                Room {room.roomNumber}
                                            </span>
                                        </div>
                                        <div className="mb-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium text-gray-600">Floor:</span>
                                                <span className="font-bold">{room.floor}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium text-gray-600">Price:</span>
                                                <span className="font-bold">₱{room.price.toLocaleString()} per night</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium text-gray-600">Capacity:</span>
                                                <span className="font-bold">{room.capacity} guests</span>
                                            </div>
                                            <div className="mt-2 border-t border-gray-100 pt-2">
                                                <div className="mb-1 text-sm font-medium text-gray-600">Features:</div>
                                                {renderRoomFeatures(room)}
                                            </div>
                                        </div>
                                        <button
                                            className={`w-full cursor-pointer rounded-md py-2 text-sm font-medium transition-colors duration-300 ${
                                                bookingDetails.selectedRoom?.id === room.id
                                                    ? 'bg-green-500 text-white'
                                                    : 'border border-gray-700 bg-white text-gray-600 hover:text-black'
                                            }`}
                                            onClick={() => handleSelectRoom(room)}
                                        >
                                            {bookingDetails.selectedRoom?.id === room.id ? 'Selected' : 'Select Room'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination controls */}
                    {renderPagination()}
                </>
            )}

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    className="rounded-md border border-black/10 px-6 py-3 font-normal text-gray-700 transition duration-300 hover:bg-black/10 hover:text-gray-900"
                    onClick={prevStep}
                >
                    Back                              
                </button>
                <button
                    type="button"
                    className={`rounded-md px-6 py-3 font-medium transition duration-300 ${
                        bookingDetails.selectedRoom ? 'bg-[#DAA520] text-white hover:bg-[#8B6514]' : 'cursor-not-allowed bg-gray-300 text-gray-500'
                    }`}
                    onClick={handleContinue}
                    disabled={!bookingDetails.selectedRoom}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default RoomSelectionStep;