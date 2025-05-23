// resources/js/Pages/Admin/Bookings/Edit.tsx
import AppLayout from '@/admin-layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Save, Upload, X } from 'lucide-react';
import React, { FormEvent, useState, useEffect } from 'react';

// Types
interface Room {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface GuestInfo {
    full_name: string;
    email: string;
    phone: string;
    address?: string;
    special_requests?: string;
}

interface Booking {
    id: number;
    booking_reference: string;
    room_id: number;
    room: Room;
    user_id: number | null;
    user: User | null;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    total_price: number;
    payment_method: 'gcash' | 'paypal';
    payment_proof?: string; // Added payment proof path
    guest_info: GuestInfo;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
}

interface EditProps {
    booking: Booking;
    rooms: Room[];
}

// Add a custom FormErrors interface to handle nested error fields
interface FormErrors {
    [key: string]: string;
}

// Define a more specific type for the form data
interface BookingFormData {
    [key: string]: any;
    room_id: number;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    total_price: number;
    payment_method: 'gcash' | 'paypal';
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    guest_info: {
        full_name: string;
        email: string;
        phone: string;
        address: string;
        special_requests: string;
    };
    _method: string;
}

const Edit: React.FC<EditProps> = ({ booking, rooms }) => {
    // Format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // State for handling file upload
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    // Initialize form with booking data
    const { data, setData, errors, processing, post, reset } = useForm<BookingFormData>({
        room_id: booking.room_id,
        check_in: formatDateForInput(booking.check_in),
        check_out: formatDateForInput(booking.check_out),
        adults: booking.adults,
        children: booking.children,
        total_price: booking.total_price,
        payment_method: booking.payment_method,
        status: booking.status,
        guest_info: {
            full_name: booking.guest_info?.full_name || '',
            email: booking.guest_info?.email || '',
            phone: booking.guest_info?.phone || '',
            address: booking.guest_info?.address || '',
            special_requests: booking.guest_info?.special_requests || '',
        },
        _method: 'put', // For Laravel method spoofing
    });

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Create FormData instance for file upload
        const formData = new FormData();
        
        // Append all form data
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'guest_info') {
                // Handle nested guest_info object
                Object.entries(value as GuestInfo).forEach(([guestKey, guestValue]) => {
                    formData.append(`guest_info[${guestKey}]`, guestValue as string);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        
        // Append payment proof file if selected
        if (paymentProof) {
            formData.append('payment_proof', paymentProof);
        }
        
        // Use post with formData
        post(`/admin/bookings/${booking.id}`, {
            onSuccess: () => {
                window.location.href = `/admin/bookings/${booking.id}`;
            },
            // FormData must be processed properly
            forceFormData: true
        });
    };

    // Handle cancel button click
    const handleCancel = () => {
        // Navigate back to the show page
        window.location.href = `/admin/bookings/${booking.id}`;
    };

    // Helper function to safely access nested errors
    const getNestedError = (path: string): string | undefined => {
        return (errors as FormErrors)[path];
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check if file size is less than 5MB (5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                setFileError('File size must be less than 5MB');
                e.target.value = ''; // Reset the input
                return;
            }
            
            setPaymentProof(file);
            setFileError(null); // Clear any previous errors
        }
    };

    // Format price for display
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(price);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Booking Details',
            href: `/admin/bookings/${booking.id}`,
        },
        {
            title: 'Edit Booking',
            href: `/admin/bookings/${booking.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Booking: ${booking.booking_reference}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={`/admin/bookings/${booking.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Details
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Booking</h1>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="mb-2 text-xl font-semibold">Booking Reference: {booking.booking_reference}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            {/* Left column */}
                            <div>
                                <div className="mb-6">
                                    <h3 className="mb-4 text-lg font-medium">Room Details</h3>

                                    <div className="mb-4">
                                        <label htmlFor="room_id" className="mb-1 block text-sm font-medium text-gray-700">
                                            Room
                                        </label>
                                        <select
                                            id="room_id"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.room_id}
                                            onChange={(e) => setData('room_id', parseInt(e.target.value))}
                                        >
                                            {rooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.room_id && <p className="mt-1 text-sm text-red-600">{errors.room_id}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="check_in" className="mb-1 block text-sm font-medium text-gray-700">
                                            Check-in Date
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                id="check_in"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                value={data.check_in}
                                                onChange={(e) => setData('check_in', e.target.value)}
                                            />
                                        </div>
                                        {errors.check_in && <p className="mt-1 text-sm text-red-600">{errors.check_in}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="check_out" className="mb-1 block text-sm font-medium text-gray-700">
                                            Check-out Date
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                id="check_out"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                value={data.check_out}
                                                onChange={(e) => setData('check_out', e.target.value)}
                                            />
                                        </div>
                                        {errors.check_out && <p className="mt-1 text-sm text-red-600">{errors.check_out}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="adults" className="mb-1 block text-sm font-medium text-gray-700">
                                                Adults
                                            </label>
                                            <input
                                                type="number"
                                                id="adults"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                min="1"
                                                value={data.adults}
                                                onChange={(e) => setData('adults', parseInt(e.target.value))}
                                            />
                                            {errors.adults && <p className="mt-1 text-sm text-red-600">{errors.adults}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="children" className="mb-1 block text-sm font-medium text-gray-700">
                                                Children
                                            </label>
                                            <input
                                                type="number"
                                                id="children"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                min="0"
                                                value={data.children}
                                                onChange={(e) => setData('children', parseInt(e.target.value))}
                                            />
                                            {errors.children && <p className="mt-1 text-sm text-red-600">{errors.children}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Payment Details</h3>

                                    <div className="mb-4">
                                        <label htmlFor="total_price" className="mb-1 block text-sm font-medium text-gray-700">
                                            Total Price
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500">₱</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="total_price"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                step="0.01"
                                                min="0"
                                                value={data.total_price}
                                                onChange={(e) => setData('total_price', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Formatted Price: {formatPrice(data.total_price)}
                                        </p>
                                        {errors.total_price && <p className="mt-1 text-sm text-red-600">{errors.total_price}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
                                        <div className="flex gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio text-blue-600"
                                                    name="payment_method"
                                                    checked={data.payment_method === 'gcash'}
                                                    onChange={() => setData('payment_method', 'gcash')}
                                                />
                                                <span className="ml-2">GCash</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio text-blue-600"
                                                    name="payment_method"
                                                    checked={data.payment_method === 'paypal'}
                                                    onChange={() => setData('payment_method', 'paypal')}
                                                />
                                                <span className="ml-2">PayPal</span>
                                            </label>
                                        </div>
                                        {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                                    </div>

                                    {/* Payment Proof Upload Section */}
                                    <div className="mb-4">
                                        <label htmlFor="payment_proof" className="mb-1 block text-sm font-medium text-gray-700">
                                            Payment Proof
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <input
                                                type="file"
                                                id="payment_proof"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        {booking.payment_proof && !paymentProof && (
                                            <div className="mt-2 flex items-center">
                                                <span className="mr-2 text-sm text-gray-500">Current file:</span>
                                                <span className="text-sm font-medium">{booking.payment_proof.split('/').pop()}</span>
                                            </div>
                                        )}
                                        {paymentProof && (
                                            <p className="mt-2 text-sm text-green-600">
                                                New file selected: {paymentProof.name}
                                            </p>
                                        )}
                                        {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
                                        {errors.payment_proof && <p className="mt-1 text-sm text-red-600">{errors.payment_proof}</p>}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Upload a screenshot or image of payment confirmation. Max size: 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div>
                                <div className="mb-6">
                                    <h3 className="mb-4 text-lg font-medium">Guest Information</h3>

                                    <div className="mb-4">
                                        <label htmlFor="guest_full_name" className="mb-1 block text-sm font-medium text-gray-700">
                                            Guest Name
                                        </label>
                                        <input
                                            type="text"
                                            id="guest_full_name"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.guest_info.full_name}
                                            onChange={(e) => setData('guest_info', { ...data.guest_info, full_name: e.target.value })}
                                        />
                                        {getNestedError('guest_info.full_name') && (
                                            <p className="mt-1 text-sm text-red-600">{getNestedError('guest_info.full_name')}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="guest_email" className="mb-1 block text-sm font-medium text-gray-700">
                                            Guest Email
                                        </label>
                                        <input
                                            type="email"
                                            id="guest_email"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.guest_info.email}
                                            onChange={(e) => setData('guest_info', { ...data.guest_info, email: e.target.value })}
                                        />
                                        {getNestedError('guest_info.email') && (
                                            <p className="mt-1 text-sm text-red-600">{getNestedError('guest_info.email')}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="guest_phone" className="mb-1 block text-sm font-medium text-gray-700">
                                            Guest Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="guest_phone"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.guest_info.phone}
                                            onChange={(e) => setData('guest_info', { ...data.guest_info, phone: e.target.value })}
                                        />
                                        {getNestedError('guest_info.phone') && (
                                            <p className="mt-1 text-sm text-red-600">{getNestedError('guest_info.phone')}</p>
                                        )}
                                    </div>

                                    {/* Add Address Field */}
                                    <div className="mb-4">
                                        <label htmlFor="guest_address" className="mb-1 block text-sm font-medium text-gray-700">
                                            Guest Address
                                        </label>
                                        <input
                                            type="text"
                                            id="guest_address"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.guest_info.address || ''}
                                            onChange={(e) => setData('guest_info', { ...data.guest_info, address: e.target.value })}
                                        />
                                        {getNestedError('guest_info.address') && (
                                            <p className="mt-1 text-sm text-red-600">{getNestedError('guest_info.address')}</p>
                                        )}
                                    </div>

                                    {/* Special Requests Field */}
                                    <div className="mb-4">
                                        <label htmlFor="special_requests" className="mb-1 block text-sm font-medium text-gray-700">
                                            Special Requests
                                        </label>
                                        <textarea
                                            id="special_requests"
                                            rows={4}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.guest_info.special_requests || ''}
                                            onChange={(e) => setData('guest_info', { ...data.guest_info, special_requests: e.target.value })}
                                        />
                                        {getNestedError('guest_info.special_requests') && (
                                            <p className="mt-1 text-sm text-red-600">{getNestedError('guest_info.special_requests')}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Booking Status */}
                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Booking Status</h3>
                                    <div className="mb-4">
                                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Edit;