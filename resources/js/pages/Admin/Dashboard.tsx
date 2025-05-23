// resources/js/pages/Admin/Dashboard.tsx
import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/admin-layouts/app-layout';
import { PlaceholderPattern } from '@/admin-components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Edit, Trash2, Eye } from 'lucide-react';

// Types for the bookings data
interface Room {
  id: number;
  name: string;
  room_number?: string;
  floor?: number;
}

interface User {
  id: number;
  name: string;
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
  payment_method: 'qr' | 'number';
  guest_info: GuestInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

// Props for the Dashboard component
interface DashboardProps {
  bookings?: Booking[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin/dashboard',
  },
];

export default function Dashboard({ bookings = [] }: DashboardProps) {
  // Debug - log the props to console to verify data is received
  useEffect(() => {
    console.log('Dashboard bookings prop:', bookings);
  }, [bookings]);

  // Function to handle editing a booking
  const handleEdit = (id: number) => {
    router.get(`/admin/bookings/${id}/edit`);
  };

  // Function to handle deleting a booking
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      router.delete(`/admin/bookings/${id}`);
    }
  };

  // Function to view booking details
  const handleView = (id: number) => {
    router.get(`/admin/bookings/${id}`);
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

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format room number based on room id (floor + room number)
  const formatRoomNumber = (roomId: number) => {
    // Generate room number from id
    // For example: room id 1 = 1011, id 6 = 2011, id 11 = 3011
    let floor = 1;
    
    if (roomId > 10) {
      floor = 3;
    } else if (roomId > 5) {
      floor = 2;
    }
    
    const roomNum = (roomId - 1) % 5 + 1;
    return `${floor}01${roomNum}`;
  };

  // Format currency in PHP format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    // Remove the title prop or make sure it's defined in AppLayoutProps
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Bookings Management</h1>
        
        {/* Debug - show a message if bookings array is empty */}
        {(!bookings || bookings.length === 0) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            No bookings data available. Make sure DashboardController is passing the data correctly.
          </div>
        )}
        
        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In/Out</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings && bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.booking_reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.room?.name ? `${booking.room.name} (${booking.room.room_number || formatRoomNumber(booking.room_id)})` : formatRoomNumber(booking.room_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.guest_info?.full_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.adults + booking.children} ({booking.adults} adults, {booking.children} children)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(booking.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(booking.id)} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(booking.id)} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(booking.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {bookings && bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}