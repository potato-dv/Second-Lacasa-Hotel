// resources/js/pages/Dashboard/BookingDetails.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Define the booking details type
interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  specialRequests?: string;
}

interface Room {
  name: string;
  type: string;
  number: string;
}

interface BookingDetails {
  id: number;
  reference: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  canCancel: boolean;
  paymentMethod: string;
  paymentProof: string | null;
  guestInfo: GuestInfo;
  createdAt: string;
}

interface BookingDetailsProps {
  booking: BookingDetails;
}

// Helper function to get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'My Bookings',
      href: '/bookings',
    },
    {
      title: `Booking #${booking.reference}`,
      href: `/bookings/${booking.reference}`,
    },
  ];

  const handleCancel = () => {
    router.post(`/bookings/${booking.reference}/cancel`);
    setIsConfirmOpen(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Booking #${booking.reference}`} />

      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Reference: {booking.reference}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/bookings">
              <Button variant="outline">Back to All Bookings</Button>
            </Link>
            {booking.canCancel && (
              <Button 
                variant="destructive" 
                onClick={() => setIsConfirmOpen(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Booking Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>
                <Badge className={getStatusBadgeColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Room Information</h3>
                <p>{booking.room.type} ({booking.room.name} #{booking.room.number})</p>
              </div>
              <div>
                <h3 className="font-medium">Stay Duration</h3>
                <p>Check-in: {booking.checkIn}</p>
                <p>Check-out: {booking.checkOut}</p>
                <p>{booking.nights} night{booking.nights !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <h3 className="font-medium">Guests</h3>
                <p>
                  {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                  {booking.children > 0 && `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}`}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Payment</h3>
                <p>Total: ${booking.totalPrice.toFixed(2)}</p>
                <p>Method: {booking.paymentMethod.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Booked on: {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{booking.guestInfo.fullName}</p>
              </div>
              <div>
                <h3 className="font-medium">Contact</h3>
                <p>Email: {booking.guestInfo.email}</p>
                <p>Phone: {booking.guestInfo.phone}</p>
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p>{booking.guestInfo.address}</p>
              </div>
              {booking.guestInfo.specialRequests && (
                <div>
                  <h3 className="font-medium">Special Requests</h3>
                  <p>{booking.guestInfo.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Proof Card (if available) */}
          {booking.paymentProof && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Payment Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img 
                    src={booking.paymentProof} 
                    alt="Payment Proof" 
                    className="max-h-96 rounded-lg object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}