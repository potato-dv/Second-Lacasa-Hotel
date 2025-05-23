{/*
    import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import Remix Icons
import {
    RiAlertLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCalendarLine,
    RiCheckboxCircleLine,
    RiCheckLine,
    RiHotelBedLine,
    RiInformationLine,
    RiMailLine,
    RiMessageLine,
    RiMoneyDollarCircleLine,
    RiPhoneLine,
    RiQrCodeLine,
    RiSmartphoneLine,
    RiUserHeartLine,
    RiUserLine,
} from 'react-icons/ri';

// Types
type RoomType = 'Standard' | 'Deluxe';
type Room = {
    id: number;
    type: RoomType;
    floor: number;
    price: number;
    capacity: number;
    available: boolean;
    images: string[];
    description: string;
    amenities: string[];
};

type BookingFormData = {
    checkIn: string;
    checkOut: string;
    guests: number;
    selectedRoom: Room | null;
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
    paymentMethod: 'qr' | 'number' | null;
};

const HotelBookingSystem: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<BookingFormData>({
        checkIn: format(new Date(), 'yyyy-MM-dd'),
        checkOut: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
        guests: 1,
        selectedRoom: null,
        fullName: '',
        email: '',
        phone: '',
        specialRequests: '',
        paymentMethod: null,
    });
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [totalNights, setTotalNights] = useState<number>(1);

    // Calculate total nights whenever check-in/check-out dates change
    useEffect(() => {
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalNights(diffDays > 0 ? diffDays : 1);
    }, [formData.checkIn, formData.checkOut]);

    // Mock hotel rooms data with images
    const hotelRooms: Room[] = [
        ...[...Array(5)].map((_, i) => ({
            id: i + 1,
            type: 'Standard' as RoomType,
            floor: 1,
            price: 2500,
            capacity: 3,
            available: true,
            images: ['/images/rooms/stdrm11.jpg', '/images/rooms/stdrm12.jpg', '/images/rooms/stdbr1.jpg'],
            description: 'Cozy standard room with modern amenities, perfect for small groups or families.',
            amenities: ['Free Wi-Fi', 'AC', 'TV', 'Mini Fridge', 'Coffee Maker', 'Daily Housekeeping'],
        })),
        ...[...Array(5)].map((_, i) => ({
            id: i + 6,
            type: 'Standard' as RoomType,
            floor: 2,
            price: 2500,
            capacity: 3,
            available: true,
            images: ['/images/rooms/stdrm11.jpg', '/images/rooms/stdrm12.jpg', '/images/rooms/stdbr1.jpg'],
            description: 'Cozy standard room with modern amenities and city view, perfect for small groups.',
            amenities: ['Free Wi-Fi', 'AC', 'TV', 'Mini Fridge', 'Coffee Maker', 'Daily Housekeeping'],
        })),
        ...[...Array(5)].map((_, i) => ({
            id: i + 11,
            type: 'Deluxe' as RoomType,
            floor: 3,
            price: 4500,
            capacity: 5,
            available: true,
            images: ['/images/rooms/dlxrm11.jpg', '/images/rooms/dlxrm12.jpg', '/images/rooms/dlxbr1.jpg'],
            description: 'Spacious deluxe room with premium amenities and panoramic views.',
            amenities: ['Free Wi-Fi', 'AC', 'Smart TV', 'Mini Bar', 'Coffee Machine', 'Premium Toiletries', 'Daily Housekeeping', 'Work Desk'],
        })),
    ];

    // Filter available rooms based on guest count
    useEffect(() => {
        const filtered = hotelRooms.filter((room) => room.capacity >= formData.guests && room.available);
        setAvailableRooms(filtered);
    }, [formData.guests]);

    const validateCurrentStep = (): boolean => {
        const errors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.checkIn) errors.checkIn = 'Check-in date is required';
            if (!formData.checkOut) errors.checkOut = 'Check-out date is required';
            if (formData.checkIn && formData.checkOut && new Date(formData.checkIn) >= new Date(formData.checkOut)) {
                errors.checkOut = 'Check-out date must be after check-in date';
            }
            if (formData.guests < 1) errors.guests = 'At least 1 guest is required';
        } else if (currentStep === 2) {
            if (!formData.selectedRoom) errors.selectedRoom = 'Please select a room';
        } else if (currentStep === 3) {
            if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
            if (!formData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!formData.email.endsWith('@gmail.com')) {
                errors.email = 'Only Gmail addresses are accepted';
            }
            if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        } else if (currentStep === 4) {
            if (!formData.paymentMethod) errors.paymentMethod = 'Please select a payment method';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const selectRoom = (room: Room) => {
        setFormData((prev) => ({ ...prev, selectedRoom: room }));
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const selectPaymentMethod = (method: 'qr' | 'number') => {
        setFormData((prev) => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            // In a real app, this would submit the form data to an API
            console.log('Form submitted:', formData);
            alert('Booking completed successfully!');

            // Reset form
            setFormData({
                checkIn: format(new Date(), 'yyyy-MM-dd'),
                checkOut: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
                guests: 1,
                selectedRoom: null,
                fullName: '',
                email: '',
                phone: '',
                specialRequests: '',
                paymentMethod: null,
            });
            setCurrentStep(1);
        }
    };

    const calculateTotal = () => {
        if (!formData.selectedRoom) return 0;
        return totalNights * formData.selectedRoom.price;
    };

    return (
        <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-white shadow-lg">
            // Header 
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: "url('/api/placeholder/1400/400')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
                <div className="relative flex h-full flex-col justify-center px-8 py-6 text-white">
                    <h1 className="mb-2 text-4xl font-bold">Luxury Hotel Booking</h1>
                    <p className="text-xl opacity-90">Experience comfort and elegance</p>
                </div>
            </div>

            // Steps Indicator 
            <div className="border-b bg-gray-50 px-8 py-4">
                <div className="mx-auto flex max-w-3xl items-center justify-between">
                    {[
                        { step: 1, icon: <RiCalendarLine className="text-xl" />, label: 'Stay Details' },
                        { step: 2, icon: <RiHotelBedLine className="text-xl" />, label: 'Room Selection' },
                        { step: 3, icon: <RiUserHeartLine className="text-xl" />, label: 'Guest Info' },
                        { step: 4, icon: <RiMoneyDollarCircleLine className="text-xl" />, label: 'Payment' },
                    ].map(({ step, icon, label }) => (
                        <div key={step} className="flex flex-col items-center">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg ${
                                    currentStep === step
                                        ? 'bg-blue-600 text-white'
                                        : currentStep > step
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {currentStep > step ? <RiCheckboxCircleLine className="text-xl" /> : icon}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            // * Main Content 
            <form onSubmit={handleSubmit} className="px-8 py-6">
                // Step 1: Stay Details 
                {currentStep === 1 && (
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                            <RiCalendarLine className="text-blue-600" />
                            <span>Stay Details</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiCalendarLine className="text-blue-600" /> Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                    />
                                    {validationErrors.checkIn && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.checkIn}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiCalendarLine className="text-blue-600" /> Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        min={formData.checkIn}
                                    />
                                    {validationErrors.checkOut && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.checkOut}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiUserLine className="text-blue-600" /> Number of Guests
                                    </label>
                                    <select
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.guests && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.guests}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-1 font-medium text-blue-800">
                                        <RiInformationLine /> Room Capacity Information
                                    </h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <RiHotelBedLine className="text-blue-600" /> Standard Rooms: Up to 3 guests
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <RiHotelBedLine className="text-blue-600" /> Deluxe Rooms: Up to 5 guests
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        // *Stay Duration Summary 
                        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-700">Stay Duration</h3>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {totalNights} {totalNights === 1 ? 'night' : 'nights'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h3 className="font-medium text-gray-700">Dates</h3>
                                    <p className="text-gray-600">
                                        {formData.checkIn &&
                                            new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                                        -{' '}
                                        {formData.checkOut &&
                                            new Date(formData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                // Step 2: Room Selection 
                {currentStep === 2 && (
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                            <RiHotelBedLine className="text-blue-600" />
                            <span>Room Selection</span>
                        </h2>

                        {availableRooms.length === 0 ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                                <RiAlertLine className="mx-auto mb-2 text-4xl text-red-500" />
                                <p className="text-lg text-red-600">No rooms available for {formData.guests} guests.</p>
                                <p className="mt-2 text-gray-600">Please adjust your guest count or try different dates.</p>
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {availableRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className={`rounded-xl border bg-white p-4 transition-all ${
                                            formData.selectedRoom?.id === room.id
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            // Room Images with Swiper 
                                            <div className="relative overflow-hidden rounded-lg">
                                                <Swiper
                                                    modules={[Navigation, Pagination]}
                                                    pagination={{ clickable: true }}
                                                    navigation
                                                    loop={true}
                                                    className="h-64 rounded-lg"
                                                >
                                                    {room.images.map((image, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <div className="h-full w-full bg-gray-100">
                                                                <img
                                                                    src={image}
                                                                    alt={`${room.type} Room View ${idx + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>

                                            // Room Details 
                                            <div className="flex flex-col justify-between md:col-span-2">
                                                <div>
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <h3 className="text-xl font-bold">{room.type} Room</h3>
                                                        <span className="text-2xl font-bold text-blue-600">₱{room.price.toLocaleString()}</span>
                                                    </div>

                                                    <p className="mb-3 text-gray-600">{room.description}</p>

                                                    // Room Amenities 
                                                    <div>
                                                        <h4 className="mb-2 font-medium text-gray-700">Amenities</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {room.amenities.map((amenity, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
                                                                >
                                                                    <RiCheckLine className="text-green-500" /> {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <RiUserLine className="text-blue-600" />
                                                        <span>Up to {room.capacity} guests</span>
                                                    </div>

                                                    <div className="mt-2 flex items-center sm:mt-0">
                                                        <span className="mr-4 text-gray-600">
                                                            {totalNights} {totalNights === 1 ? 'night' : 'nights'}:{' '}
                                                            <span className="font-semibold">₱{(room.price * totalNights).toLocaleString()}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => selectRoom(room)}
                                                            className={`rounded-lg px-6 py-2 transition-all ${
                                                                formData.selectedRoom?.id === room.id
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                            }`}
                                                        >
                                                            {formData.selectedRoom?.id === room.id ? (
                                                                <span className="flex items-center gap-1">
                                                                    <RiCheckboxCircleLine /> Selected
                                                                </span>
                                                            ) : (
                                                                'Select Room'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {validationErrors.selectedRoom && (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                        <RiAlertLine /> {validationErrors.selectedRoom}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                // Step 3: Guest Information 
                {currentStep === 3 && (
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                            <RiUserHeartLine className="text-blue-600" />
                            <span>Guest Information</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiUserHeartLine className="text-blue-600" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. Juan Dela Cruz"
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {validationErrors.fullName && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiMailLine className="text-blue-600" /> Email (Gmail only)
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="youremail@gmail.com"
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiPhoneLine className="text-blue-600" /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. 09123456789"
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {validationErrors.phone && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <RiAlertLine /> {validationErrors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block flex items-center gap-1 font-medium text-gray-700">
                                        <RiMessageLine className="text-blue-600" /> Special Requests (Optional)
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleChange}
                                        placeholder="Any special requests or requirements..."
                                        className="h-40 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>

                                // Booking Summary 
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-1 text-lg font-medium text-gray-800">
                                        <RiInformationLine className="text-blue-600" /> Booking Summary
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p className="flex justify-between">
                                            <span>Room Type:</span>
                                            <span className="font-medium">{formData.selectedRoom?.type} Room</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Check-in:</span>
                                            <span>{formData.checkIn && new Date(formData.checkIn).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Check-out:</span>
                                            <span>{formData.checkOut && new Date(formData.checkOut).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Stay Duration:</span>
                                            <span>
                                                {totalNights} {totalNights === 1 ? 'night' : 'nights'}
                                            </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Guests:</span>
                                            <span>{formData.guests}</span>
                                        </p>
                                        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-blue-600">₱{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                // Step 4: Payment 
                {currentStep === 4 && (
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                            <RiMoneyDollarCircleLine className="text-blue-600" />
                            <span>Payment</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-6">
                                    <h3 className="mb-4 text-xl font-medium text-blue-800">Booking Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Room Type:</span>
                                            <span className="font-medium">{formData.selectedRoom?.type} Room</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Check-in:</span>
                                            <span>{formData.checkIn && new Date(formData.checkIn).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Check-out:</span>
                                            <span>{formData.checkOut && new Date(formData.checkOut).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nights:</span>
                                            <span>{totalNights}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Guests:</span>
                                            <span>{formData.guests}</span>
                                        </div>
                                        <div className="mt-3 border-t border-blue-200 pt-3">
                                            <div className="flex justify-between text-lg">
                                                <span>Room Rate:</span>
                                                <span>
                                                    ₱{formData.selectedRoom?.price.toLocaleString()} x {totalNights}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex justify-between text-xl font-bold text-blue-800">
                                                <span>Total Amount:</span>
                                                <span>₱{calculateTotal().toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                        <p className="flex items-center gap-2 text-yellow-800">
                                            <RiInformationLine className="text-lg text-yellow-600" />
                                            Payment will be processed after confirmation. Your booking will be secured once payment is complete.
                                        </p>
                                    </div>
                                </div>

                                <h3 className="mb-4 text-lg font-medium">Guest Information</h3>
                                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <RiUserHeartLine className="text-blue-600" />
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium">{formData.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RiMailLine className="text-blue-600" />
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RiPhoneLine className="text-blue-600" />
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{formData.phone}</span>
                                    </div>
                                    {formData.specialRequests && (
                                        <div className="flex gap-2">
                                            <RiMessageLine className="mt-1 flex-shrink-0 text-blue-600" />
                                            <div>
                                                <span className="text-gray-600">Special Requests:</span>
                                                <p className="mt-1 font-medium">{formData.specialRequests}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Payment Method: GCash</h3>
                                <p className="mb-4 text-gray-600">Please select your preferred GCash payment method:</p>

                                <div className="mb-6 grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => selectPaymentMethod('qr')}
                                        className={`flex flex-col items-center rounded-lg border p-4 ${
                                            formData.paymentMethod === 'qr'
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <RiQrCodeLine className="mb-2 text-4xl text-blue-600" />
                                        <span className="font-medium">Scan QR Code</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => selectPaymentMethod('number')}
                                        className={`flex flex-col items-center rounded-lg border p-4 ${
                                            formData.paymentMethod === 'number'
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <RiSmartphoneLine className="mb-2 text-4xl text-blue-600" />
                                        <span className="font-medium">GCash Number</span>
                                    </button>
                                </div>

                                {formData.paymentMethod === 'qr' && (
                                    <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6">
                                        <div className="mb-4 flex h-64 w-64 items-center justify-center rounded-lg bg-white p-3 shadow-md">
                                            // QR Code Placeholder 
                                            <div className="relative h-full w-full border-4 border-blue-500 p-4">
                                                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
                                                    {Array(64)
                                                        .fill(0)
                                                        .map((_, i) => (
                                                            <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="mb-1 text-lg font-medium text-blue-800">Scan this QR code with your GCash app</h4>
                                        <p className="text-center text-gray-600">Open your GCash app, tap on "Scan", and scan this QR code</p>
                                        <div className="mt-4 w-full rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                            <p className="flex items-center gap-1 text-sm text-yellow-800">
                                                <RiInformationLine /> Please complete the payment within 15 minutes
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {formData.paymentMethod === 'number' && (
                                    <div className="rounded-lg border border-gray-200 p-6">
                                        <div className="mb-6 flex flex-col items-center">
                                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                                <RiSmartphoneLine className="text-3xl text-blue-600" />
                                            </div>
                                            <h4 className="text-lg font-medium">Send payment to GCash number:</h4>
                                            <p className="mt-2 text-2xl font-bold text-blue-800">0917 123 4567</p>
                                            <p className="text-gray-700">Account Name: Luxury Hotel Booking</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-lg bg-gray-50 p-4">
                                                <h5 className="mb-2 flex items-center gap-1 font-medium">
                                                    <RiInformationLine className="text-blue-600" /> Payment Steps
                                                </h5>
                                                <ol className="ml-6 list-decimal space-y-2 text-gray-700">
                                                    <li>Open your GCash app</li>
                                                    <li>Tap on "Send Money"</li>
                                                    <li>Enter the number: 0917 123 4567</li>
                                                    <li>Enter the exact amount: ₱{calculateTotal().toLocaleString()}</li>
                                                    <li>Add your booking reference in the message: {formData.fullName}</li>
                                                    <li>Take a screenshot of your payment receipt</li>
                                                </ol>
                                            </div>

                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                                <p className="flex items-center gap-1 text-sm text-yellow-800">
                                                    <RiInformationLine /> After sending payment, please take a screenshot of the receipt for
                                                    verification. You'll receive a confirmation email once payment is verified.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {validationErrors.paymentMethod && (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                        <RiAlertLine /> {validationErrors.paymentMethod}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                // Navigation buttons 
                <div className="mt-10 flex justify-between">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                        >
                            <RiArrowLeftSLine className="text-xl" /> Back
                        </button>
                    )}
                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className={`flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${currentStep === 1 && 'ml-auto'}`}
                        >
                            Next <RiArrowRightSLine className="text-xl" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <RiCheckboxCircleLine className="text-xl" /> Complete Booking
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default HotelBookingSystem;
*/}
