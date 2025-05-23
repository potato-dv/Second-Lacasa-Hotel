// resources/js/types/index.ts
export * from './index.d.js';

export interface RoomData {
    id: number;
    type: string;
    roomNumber: string;
    floor: number | string;
    price: number;
    capacity: number;
    features: {
        [key: string]: boolean;
    };
}

export interface GuestInformationStep {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    specialRequests?: string;
}

export interface BookingDetails {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    selectedRoom?: RoomData;
    guestInfo: GuestInformationStep;
    paymentMethod?: 'gcash' | 'paypal';
    paymentProof?: File;
}

export interface BookingResponse {
    id: string;
    room: {
        type: string;
        roomNumber: string;
    };
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    totalPrice: number;
    paymentMethod: string;
    paymentProofUrl?: string;
    guestInfo: GuestInformationStep;
    status: string;
}