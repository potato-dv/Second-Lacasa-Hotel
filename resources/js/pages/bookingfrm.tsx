// resources/js/pages/bookingfrm.tsx
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { GuestInformationStep, PaymentStep, ProgressBar, RoomSelectionStep, StayDetailsStep } from '../components3';
import Footer from '../components3/footer';
import Navbar from '../components3/navbar';
import { BookingDetails, User } from '../types';

const BookingForm: React.FC = () => {
    const { auth } = usePage().props as any;
    const user = auth?.user as User | undefined;
    const isAuthenticated = !!user;

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        checkIn: new Date(),
        checkOut: new Date(),
        adults: 1,
        children: 0,
        guestInfo: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            specialRequests: '',
        }
    });

    // Pre-fill user information if authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setBookingDetails(prev => ({
                ...prev,
                guestInfo: {
                    ...prev.guestInfo,
                    fullName: user.name || '',
                    email: user.email || '',
                    // You can add more fields from the user object if available
                }
            }));
        }
    }, [isAuthenticated, user]);

    const updateBookingDetails = (updates: Partial<BookingDetails>) => {
        setBookingDetails((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Map step number to component
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StayDetailsStep bookingDetails={bookingDetails} updateBookingDetails={updateBookingDetails} nextStep={nextStep} />;
            case 2:
                return (
                    <RoomSelectionStep
                        bookingDetails={bookingDetails}
                        updateBookingDetails={updateBookingDetails}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <GuestInformationStep
                        bookingDetails={bookingDetails}
                        updateBookingDetails={updateBookingDetails}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        isAuthenticated={isAuthenticated}
                        userData={user}
                    />
                );
            case 4:
                return (
                    <PaymentStep 
                        bookingDetails={bookingDetails} 
                        prevStep={prevStep} 
                        isAuthenticated={isAuthenticated}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                <Navbar />
                
                <div className="mx-auto max-w-6xl bg-white py-8 px-8">
                    <h1 className="mb-8 text-left text-3xl font-bold text-gray-600">Just a few steps away from your perfect stay.</h1>
                    
                    {/* Authentication Status Banner - Optional */}
                    {isAuthenticated ? (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                            <i className="ri-user-follow-line mr-2"></i>
                            <span>Welcome back, {user?.name}! You're signed in and ready to book.</span>
                        </div>
                    ) : (
                        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-center">
                            <i className="ri-information-line mr-2"></i>
                            <span>
                                You're booking as a guest. <a href={route('login')} className="underline font-medium">Sign in</a> for a faster booking experience.
                            </span>
                        </div>
                    )}
                    
                    <ProgressBar currentStep={currentStep} totalSteps={4} />
                    <div className="mt-8">{renderStepContent()}</div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default BookingForm;