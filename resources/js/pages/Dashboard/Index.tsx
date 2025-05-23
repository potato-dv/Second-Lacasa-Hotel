import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BadgeCheck, 
  Clock, 
  Home, 
  CalendarCheck, 
  Calendar, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define booking type
interface Booking {
  id: number;
  reference: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  canCancel: boolean;
}

// Define the dashboard stats type
interface DashboardProps {
  activeBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  recentBookings?: Booking[];
  auth: {
    user: {
      name: string;
    }
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
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

export default function Dashboard() {
  const { auth, activeBookings = 0, pendingBookings = 0, completedBookings = 0, 
    cancelledBookings = 0, recentBookings = [] } = usePage().props as unknown as DashboardProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/booking">
            <Button>Book a Room</Button>
          </Link>
        </div>

        {/* Booking Stats Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Your Booking Summary</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Active Bookings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <BadgeCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBookings}</div>
                <p className="text-xs text-muted-foreground">Confirmed and upcoming stays</p>
              </CardContent>
            </Card>

            {/* Pending Bookings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBookings}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>

            {/* Completed Bookings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Stays</CardTitle>
                <CalendarCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBookings}</div>
                <p className="text-xs text-muted-foreground">Past completed bookings</p>
              </CardContent>
            </Card>

            {/* Cancelled Bookings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
                <X className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cancelledBookings}</div>
                <p className="text-xs text-muted-foreground">Previously cancelled bookings</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/bookings" className="w-full">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    View All Bookings
                  </CardTitle>
                  <CardDescription>
                    Manage all your existing bookings
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    View details <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/booking" className="w-full">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    New Booking
                  </CardTitle>
                  <CardDescription>
                    Reserve a new room for your stay
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    Book now <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/settings/profile" className="w-full">
              <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    Manage profile <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent Bookings Section */}
        {recentBookings && recentBookings.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <Link href="/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.reference}
                        </TableCell>
                        <TableCell>{booking.roomType}</TableCell>
                        <TableCell>
                          {booking.checkIn} - {booking.checkOut}
                        </TableCell>
                        <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/bookings/${booking.reference}`}>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </AppLayout>
  );
}