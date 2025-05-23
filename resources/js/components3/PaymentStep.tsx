// resources/js/components3/PaymentStep.tsx
import React, { useState } from 'react';
import { BookingAPI } from '../services/api';
import { BookingDetails, BookingResponse } from '../types';
import { calculateNights, formatDate } from '../utils/dateUtils';

interface PaymentStepProps {
    bookingDetails: BookingDetails;
    prevStep: () => void;
    isAuthenticated?: boolean;
    onBookingComplete?: (response: BookingResponse) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
    bookingDetails, 
    prevStep,
    isAuthenticated,
    onBookingComplete 
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'paypal' | null>(null);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const calculateTotalPrice = () => {
        if (!bookingDetails.checkIn || !bookingDetails.checkOut || !bookingDetails.selectedRoom) {
            return 0;
        }

        const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
        return bookingDetails.selectedRoom.price * nights;
    };

    const handleCompleteBooking = async () => {
        if (!paymentMethod) {
            setError('Please select a payment method.');
            return;
        }

        // Payment proof is required according to the backend validation
        if (!paymentProof) {
            setError('Please upload proof of payment. This is required to complete your booking.');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            // Create FormData object for multipart/form-data submission (file upload)
            const formData = new FormData();
            
            // Add booking details to the form data
            formData.append('checkIn', bookingDetails.checkIn.toISOString().split('T')[0]);
            formData.append('checkOut', bookingDetails.checkOut.toISOString().split('T')[0]);
            formData.append('adults', bookingDetails.adults.toString());
            formData.append('children', bookingDetails.children.toString());
            formData.append('roomId', bookingDetails.selectedRoom!.id.toString());
            
            // Add guest info
            formData.append('guestInfo[fullName]', bookingDetails.guestInfo.fullName);
            formData.append('guestInfo[email]', bookingDetails.guestInfo.email);
            formData.append('guestInfo[phone]', bookingDetails.guestInfo.phone);
            formData.append('guestInfo[address]', bookingDetails.guestInfo.address);
            
            if (bookingDetails.guestInfo.specialRequests) {
                formData.append('guestInfo[specialRequests]', bookingDetails.guestInfo.specialRequests);
            }
            
            // Add payment method
            formData.append('paymentMethod', paymentMethod);
            
            // Add payment proof file - this is required by the backend
            formData.append('paymentProof', paymentProof);
            
           
            
            // Send request to create booking with file upload
            const response = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    // Don't set Content-Type when using FormData - browser will set it with proper boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create booking');
            }

            const responseData = await response.json();
            
            // Update state with the booking response
            setBookingResponse(responseData);
            setIsBookingComplete(true);
            
            // Call the optional callback if provided
            if (onBookingComplete) {
                onBookingComplete(responseData);
            }
        } catch (err) {
            console.error('Failed to complete booking:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete the booking. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check if file size is less than 5MB (5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                e.target.value = ''; // Reset the input
                return;
            }
            setPaymentProof(file);
            setError(null); // Clear any previous errors
        }
    };

    // Common booking summary component to avoid repetition
    const BookingSummary = () => (
        <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
            <h4 className="mb-4 font-semibold text-[#8B6514]">Booking Summary</h4>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Room:</span>
                <span>
                    {bookingDetails.selectedRoom?.type} Room {bookingDetails.selectedRoom?.roomNumber}
                </span>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Floor:</span>
                <span>{bookingDetails.selectedRoom?.floor}</span>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Check-in:</span>
                <span>{formatDate(bookingDetails.checkIn)}</span>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Check-out:</span>
                <span>{formatDate(bookingDetails.checkOut)}</span>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Nights:</span>
                <span>{calculateNights(bookingDetails.checkIn, bookingDetails.checkOut)}</span>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
                <span className="text-gray-600">Guests:</span>
                <span>
                    {bookingDetails.adults} Adult(s), {bookingDetails.children} Children
                </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-200 pt-2 font-semibold">
                <span className="text-gray-800">Total Amount:</span>
                <span>₱{calculateTotalPrice().toLocaleString()}</span>
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="mb-6 text-2xl pt-6 font-semibold text-gray-900">Step 4: Payment</h2>

            {isBookingComplete && bookingResponse ? (
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Booking Pending</h3>
                    <p className="mb-1 text-gray-600">Thank you for your booking, {bookingDetails.guestInfo.fullName}.</p>
                    <p className="mb-2 text-gray-600">A confirmation will be sent to {bookingDetails.guestInfo.email} once payment is verified.</p>
                    <p className="mb-6 text-gray-600">Your booking reference: <span className="font-bold">{bookingResponse.id}</span></p>

                    <BookingSummary />

                    <button
                        className="rounded-md bg-[#DAA520] px-6 py-3 font-medium text-white transition duration-300 hover:bg-[#8B6514]"
                        onClick={() => window.location.reload()}
                    >
                        Book Another Room
                    </button>
                </div>
            ) : (
                <>
                    <BookingSummary />

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="mb-4 font-semibold text-gray-900">Select Payment Method</h3>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div
                                className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                                    paymentMethod === 'gcash' ? 'border-black/10 bg-black/25' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setPaymentMethod('gcash')}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 rounded-full bg-gray-100 p-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-[#8B6514]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v1m6 11h2m-6 0h-2m0 0v5m0 0h5m-5 0v-5m-6 0H4m0 0h5m-5 0v5m0 0h5m-5 0v-5"
                                            />
                                        </svg>
                                    </div>
                                    <span className="font-medium">GCash</span>
                                </div>
                            </div>

                            <div
                                className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                                    paymentMethod === 'paypal' ? 'border-black/10 bg-black/25' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 rounded-full bg-gray-100 p-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-[#8B6514]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="font-medium">PayPal</span>
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'gcash' && (
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                                <div className="flex flex-col items-center mb-4">
                                    <h4 className="mb-4 font-semibold">GCash Payment Options</h4>
                                    
                                    <div className="mb-4 flex flex-col w-full">
                                        <div className="mb-6 border-b pb-6">
                                            <h5 className="font-medium mb-2">Option 1: Scan QR Code</h5>
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-[#8B6514]">QR Code</div>
                                                        <p className="text-gray-500">Scan to Pay</p>
                                                    </div>
                                                </div>
                                                <p className="text-center text-gray-600">Scan this QR code with your GCash app to complete the payment.</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h5 className="font-medium mb-2">Option 2: Send to GCash Number</h5>
                                            <p className="mb-2 text-lg">
                                                GCash Number: <span className="font-bold">0917 123 4567</span>
                                            </p>
                                            <p className="text-gray-600 mb-4">Send the total amount to this GCash number to complete your booking.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full mt-4">
                                        <h5 className="font-medium mb-2">Upload Payment Proof <span className="text-red-500">*</span></h5>
                                        <p className="text-gray-600 mb-3 text-sm">
                                            Please upload a screenshot of your payment confirmation or receipt (Max: 5MB)
                                        </p>
                                        <input 
                                            type="file" 
                                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                                            onChange={handleFileChange}
                                            className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        {paymentProof && (
                                            <p className="mt-2 text-green-600 text-sm">
                                                File uploaded: {paymentProof.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'paypal' && (
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                                <div className="flex flex-col items-center">
                                    <h4 className="mb-4 font-semibold">PayPal Payment</h4>
                                    
                                    <p className="mb-6 text-center">
                                        Please send the payment to our PayPal account: <span className="font-bold">lacasahotel@gmail.com</span>
                                    </p>
                                    
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center w-full">
                                        <p className="text-blue-800 font-medium mb-2">Steps to complete payment:</p>
                                        <ol className="text-left text-blue-700 pl-6 list-decimal">
                                            <li className="mb-1">Log in to your PayPal account</li>
                                            <li className="mb-1">Click "Send & Request"</li>
                                            <li className="mb-1">Enter our email: lacasahotel@gmail.com</li>
                                            <li className="mb-1">Enter amount: ₱{calculateTotalPrice().toLocaleString()}</li>
                                            <li className="mb-1">In the note, include your booking name and dates</li>
                                            <li>Complete the payment</li>
                                        </ol>
                                    </div>
                                    
                                    <div className="w-full mt-4">
                                        <h5 className="font-medium mb-2">Upload Payment Proof <span className="text-red-500">*</span></h5>
                                        <p className="text-gray-600 mb-3 text-sm">
                                            Please upload a screenshot of your PayPal transaction confirmation (Max: 5MB)
                                        </p>
                                        <input 
                                            type="file" 
                                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                                            onChange={handleFileChange}
                                            className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        {paymentProof && (
                                            <p className="mt-2 text-green-600 text-sm">
                                                File uploaded: {paymentProof.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            className="rounded-md border border-black/20 px-6 py-3 font-normal text-gray-700 transition duration-300 hover:bg-black/10 hover:text-gray-900"
                            onClick={prevStep}                                                                    
                            disabled={isLoading}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className={`rounded-md px-6 py-3 font-medium transition duration-300 ${
                                paymentMethod && !isLoading 
                                    ? 'bg-[#DAA520] text-white hover:bg-[#8B6514]' 
                                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                            }`}
                            onClick={handleCompleteBooking}
                            disabled={!paymentMethod || isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Complete Booking'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentStep;