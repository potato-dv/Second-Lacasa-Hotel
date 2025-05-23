import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Define the booking type
interface Booking {
  id: number;
  reference: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  canCancel: boolean;
  paymentMethod: string;
  createdAt: string;
}

interface BookingsProps {
  bookings: Booking[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'My Bookings',
    href: '/bookings',
  },
];

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

export default function Bookings({ bookings }: BookingsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const openCancelDialog = (reference: string) => {
    setBookingToCancel(reference);
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
    if (bookingToCancel) {
      router.post(`/bookings/${bookingToCancel}/cancel`);
      setIsConfirmOpen(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Bookings" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <Link href="/booking">
            <Button>Book a Room</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h2 className="mb-2 text-xl font-medium">No bookings found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't made any bookings yet.
            </p>
            <Link href="/booking" className="mt-4">
              <Button>Book a Room</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.reference}
                    </TableCell>
                    <TableCell>
                      {booking.roomType} (#{booking.roomNumber})
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{booking.checkIn} to {booking.checkOut}</span>
                        <span className="text-sm text-gray-500">
                          {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                      {booking.children > 0 && `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}`}
                    </TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/bookings/${booking.reference}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {booking.canCancel && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openCancelDialog(booking.reference)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
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