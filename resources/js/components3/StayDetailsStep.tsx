// resources/js/components3/StayDetails.tsx
import { format } from 'date-fns';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingDetails } from '../types';

interface StayDetailsStepProps {
    bookingDetails: BookingDetails;
    updateBookingDetails: (updates: Partial<BookingDetails>) => void;
    nextStep: () => void;
}

const StayDetailsStep: React.FC<StayDetailsStepProps> = ({ bookingDetails, updateBookingDetails, nextStep }) => {
    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
            alert('Please select both check-in and check-out dates.');
            return;
        }

        if (bookingDetails.adults + bookingDetails.children < 1) {
            alert('At least one guest is required.');
            return;
        }

        // Format the dates before passing to the next step
        const formattedBookingDetails = {
            ...bookingDetails,
            check_In: format(bookingDetails.checkIn, 'yyyy-MM-dd'), // Format the check-in date
            check_Out: format(bookingDetails.checkOut, 'yyyy-MM-dd'), // Format the check-out date
        };

        nextStep();
    };

    return (
        <form onSubmit={handleContinue}>
            <h2 className="mb-6 text-2xl pt-6 font-semibold text-gray-900">Step 1: Stay Details</h2>

            <div className="mb-5">
                <label className="mb-2 block font-medium text-gray-700">Check-in Date:</label>
                <DatePicker
                    selected={bookingDetails.checkIn}
                    onChange={(date) => updateBookingDetails({ checkIn: date as Date })}
                    selectsStart
                    startDate={bookingDetails.checkIn}
                    endDate={bookingDetails.checkOut}
                    minDate={new Date()}
                    className="w-full rounded-md border border-gray-300 p-3 focus:ring-1 focus:ring-[#DAA520] focus:outline-none"
                    required
                />
            </div>

            <div className="mb-5">
                <label className="mb-2 block font-medium text-gray-700">Check-out Date:</label>
                <DatePicker
                    selected={bookingDetails.checkOut}
                    onChange={(date) => updateBookingDetails({ checkOut: date as Date })}
                    selectsEnd
                    startDate={bookingDetails.checkIn}
                    endDate={bookingDetails.checkOut}
                    minDate={bookingDetails.checkIn || new Date()}
                    className="w-full rounded-md border border-gray-300 p-3 focus:ring-1 focus:ring-[#DAA520] focus:outline-none"
                    required
                />
            </div>

            <div className="mb-5 flex gap-6">
                <div className="flex-1">
                    <label className="mb-2 block font-medium text-gray-700">Adults:</label>
                    <div className="flex overflow-hidden rounded-md border border-gray-300">
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateBookingDetails({ adults: Math.max(1, bookingDetails.adults - 1) })}
                        >
                            -
                        </button>
                        <span className="flex flex-1 items-center justify-center p-2">{bookingDetails.adults}</span>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateBookingDetails({ adults: Math.min(5, bookingDetails.adults + 1) })}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <label className="mb-2 block font-medium text-gray-700">Children:</label>
                    <div className="flex overflow-hidden rounded-md border border-gray-300">
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateBookingDetails({ children: Math.max(0, bookingDetails.children - 1) })}
                        >
                            -
                        </button>
                        <span className="flex flex-1 items-center justify-center p-2">{bookingDetails.children}</span>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200"
                            onClick={() => updateBookingDetails({ children: Math.min(4, bookingDetails.children + 1) })}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="my-6 rounded border-l-4 border-[#DAA520] bg-amber-50 p-4">
                <p className="text-[#8B6514]">Standard Rooms: Max 3 guests</p>
                <p className="text-[#8B6514]">Deluxe Rooms: Max 5 guests</p>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    className="rounded-md bg-[#DAA520] px-6 py-3 font-medium text-white transition duration-300 hover:bg-[#8B6514]"
                >
                    Continue
                </button>
            </div>
        </form>
    );
};

export default StayDetailsStep;
