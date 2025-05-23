// resources/js/Pages/Admin/Bookings/Show.tsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/admin-layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { 
  ArrowLeft, Calendar, Users, CreditCard, Tag, Home, User, 
  MapPin, FileText, Receipt, Download, Eye, FileImage 
} from 'lucide-react';

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

interface PaymentProof {
  id: number;
  file_path: string;
  uploaded_at: string;
  file_name?: string; // Added for better display
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
  payment_proof?: PaymentProof;
  guest_info: GuestInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

interface ShowProps {
  booking: Booking;
}

const Show: React.FC<ShowProps> = ({ booking }) => {
  // State for image preview modal
  const [showPreview, setShowPreview] = useState(false);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to format price in PHP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to display formatted payment method
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'gcash':
        return 'GCash';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  // Function to get file extension from path
  const getFileExtension = (filePath: string | undefined): string => {
    if (!filePath) return '';
    const extension = filePath.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  // Function to check if file is an image
  const isImage = (filePath: string | undefined): boolean => {
    if (!filePath) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = getFileExtension(filePath);
    return imageExtensions.includes(extension);
  };

  // Function to get file name from path
  const getFileName = (filePath: string | undefined): string => {
    if (!filePath) return 'Unknown File';
    // Extract filename from path
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 1];
  };

  // Function to get the correct public URL for the file
  const getPublicFilePath = (filePath: string | undefined): string => {
    if (!filePath) return '';
    
    // If the path already starts with http:// or https://, it's an absolute URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // If the path already starts with /storage/, assume it's correctly formatted
    if (filePath.startsWith('/storage/')) {
      return filePath;
    }
    
    // Check if the path includes "public/storage" and transform it
    if (filePath.includes('public/storage')) {
      // Replace "public/storage" with just "/storage"
      return filePath.replace('public/storage', '/storage');
    }
    
    // If the path is just a file name or relative path
    // Add proper storage prefix
    if (filePath.includes('bookings/payment_proofs')) {
      return `/storage/${filePath}`;
    }
    
    // For other cases, assume it's a path relative to the storage directory
    return `/storage/${filePath}`;
  };

  // Function to download payment proof
  const downloadPaymentProof = () => {
    if (!booking.payment_proof || !booking.payment_proof.file_path) return;
    
    const publicFilePath = getPublicFilePath(booking.payment_proof.file_path);
    const link = document.createElement('a');
    link.href = publicFilePath;
    link.download = booking.payment_proof.file_name || getFileName(booking.payment_proof.file_path);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Debug the file path
  console.log('Original file path:', booking.payment_proof?.file_path);
  const publicFilePath = booking.payment_proof ? getPublicFilePath(booking.payment_proof.file_path) : '';
  console.log('Public file path:', publicFilePath);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Admin Dashboard',
      href: '/admin/dashboard',
    },
    {
      title: 'Booking Details',
      href: `/admin/bookings/${booking.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Booking: ${booking.booking_reference}`} />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Booking Details</h1>
          </div>
          
          <div>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Reference and Basic Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Booking Reference: {booking.booking_reference}</h2>
                <p className="text-gray-600">Created on: {new Date(booking.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Main booking details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-gray-500" />
                  Room Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2"><span className="font-medium">Room:</span> {booking.room?.name || `Room #${booking.room_id}`}</p>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Check-in:</span> {formatDate(booking.check_in)}
                  </div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Check-out:</span> {formatDate(booking.check_out)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Guests:</span> {booking.adults} adults, {booking.children} children
                  </div>
                </div>
              </div>
            
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2"><span className="font-medium">Total Price:</span> {formatPrice(booking.total_price)}</p>
                  <p className="mb-4"><span className="font-medium">Payment Method:</span> {getPaymentMethodDisplay(booking.payment_method)}</p>
                  
                  {/* Enhanced Proof of Payment Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start">
                      <Receipt className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                      <div className="w-full">
                        <span className="font-medium">Proof of Payment:</span>
                        {booking.payment_proof ? (
                          <div className="mt-3">
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-center mb-3 md:mb-0">
                                  <FileImage className="h-8 w-8 text-blue-500 mr-3" />
                                  <div>
                                    <p className="font-medium text-gray-800">{booking.payment_proof.file_path ? getFileName(booking.payment_proof.file_path) : 'Unknown File'}</p>
                                    <p className="text-xs text-gray-500">
                                      Uploaded: {new Date(booking.payment_proof.uploaded_at).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  {isImage(booking.payment_proof.file_path) && (
                                    <button
                                      onClick={() => setShowPreview(true)}
                                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Preview
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={downloadPaymentProof}
                                    className="flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </button>
                                </div>
                              </div>
                              
                              {/* Image preview thumbnail */}
                              {isImage(booking.payment_proof.file_path) && (
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                  <div className="max-h-48 overflow-hidden rounded border border-gray-200">
                                    <img 
                                      src={getPublicFilePath(booking.payment_proof.file_path)} 
                                      alt="Payment Proof" 
                                      className="w-full object-contain cursor-pointer"
                                      onClick={() => setShowPreview(true)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic mt-1">No payment proof uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Guest Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-2"><span className="font-medium">Name:</span> {booking.guest_info?.full_name || 'N/A'}</p>
                  <p className="mb-2"><span className="font-medium">Email:</span> {booking.guest_info?.email || 'N/A'}</p>
                  <p className="mb-2"><span className="font-medium">Phone:</span> {booking.guest_info?.phone || 'N/A'}</p>
                  
                  {/* Address Field */}
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                    <div>
                      <span className="font-medium">Address:</span> {booking.guest_info?.address || 'N/A'}
                    </div>
                  </div>
                  
                  {/* Special Requests Field */}
                  {booking.guest_info?.special_requests && (
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                      <div>
                        <span className="font-medium">Special Requests:</span>
                        <p className="mt-1 text-gray-600">{booking.guest_info.special_requests}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
                
              {booking.user && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    User Account
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-2"><span className="font-medium">Name:</span> {booking.user.name}</p>
                    <p><span className="font-medium">Email:</span> {booking.user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <Link
              href={`/admin/bookings/${booking.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && booking.payment_proof && isImage(booking.payment_proof.file_path) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Payment Proof</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto p-4 flex items-center justify-center max-h-[calc(90vh-8rem)]">
              <img 
                src={getPublicFilePath(booking.payment_proof.file_path)} 
                alt="Payment Proof" 
                className="max-w-full h-auto object-contain"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={downloadPaymentProof}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Show;