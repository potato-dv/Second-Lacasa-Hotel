// resources/js/components3/GuestInformationStep.tsx
import React, { useState, useEffect } from 'react';
import { BookingDetails, User } from '../types';

interface GuestInformationStepProps {
  bookingDetails: BookingDetails;
  updateBookingDetails: (updates: Partial<BookingDetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isAuthenticated?: boolean;
  userData?: User;
}

const GuestInformationStep: React.FC<GuestInformationStepProps> = ({
  bookingDetails,
  updateBookingDetails,
  nextStep,
  prevStep,
  isAuthenticated = false,
  userData
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If user is logged in, pre-fill the form
  useEffect(() => {
    if (isAuthenticated && userData) {
      updateBookingDetails({
        guestInfo: {
          ...bookingDetails.guestInfo,
          fullName: userData.name || bookingDetails.guestInfo.fullName,
          email: userData.email || bookingDetails.guestInfo.email,
          // Add more fields if you have them in user data
        }
      });
    }
  }, [isAuthenticated, userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateBookingDetails({
      guestInfo: {
        ...bookingDetails.guestInfo,
        [name]: value
      }
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { fullName, email, phone } = bookingDetails.guestInfo;
    
    // Required fields
    if (!fullName || fullName.trim() === '') {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email || email.trim() === '') {
      newErrors.email = 'Email is required';
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!phone || phone.trim() === '') {
      newErrors.phone = 'Phone number is required';
    } else {
      // Phone validation - allowing digits, plus signs, spaces, and hyphens
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        newErrors.phone = 'Phone number must be between 10 and 15 digits';
      }
    }
    
    // Address validation is made optional in this version
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl text-black font-semibold mb-6">Step 3: Guest Information</h2>
      
      {isAuthenticated && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-700">
            <i className="ri-user-line mr-1"></i>
            Your basic details are pre-filled from your account. Please verify and complete any missing information.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={bookingDetails.guestInfo.fullName || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6514]`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingDetails.guestInfo.email || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6514]`}
              placeholder="Enter your email"
              readOnly={isAuthenticated}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            {isAuthenticated && (
              <p className="text-xs text-gray-500 mt-1">Email locked as per your account details</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={bookingDetails.guestInfo.phone || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6514]`}
              placeholder="e.g., +1 (123) 456-7890"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={bookingDetails.guestInfo.address || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6514]"
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={bookingDetails.guestInfo.specialRequests || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6514]"
            placeholder="Any special requests or requirements"
          ></textarea>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 border border-black/10 font-normal text-gray-700 rounded-md hover:bg-black/10 hover:text-gray-900 transition duration-300"
          >
            Back                         
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#DAA520] text-white rounded-md hover:bg-[#8B6514] transition duration-300"
          >
            Continue to Payment
          </button>
        </div>    
      </form>
    </div>
  );
};

export default GuestInformationStep;