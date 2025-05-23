// resources/js/models/Room.ts
export abstract class Room {
  constructor(
    public id: number,
    public roomNumber: string,
    public floor: number,
    public price: number = 0,
    public capacity: number = 0,
    public available: boolean = true
  ) {}


  abstract get type(): string;
  abstract get features(): { [key: string]: boolean };
}

export class StandardRoom extends Room {
  constructor(
    id: number,
    roomNumber: string,
    floor: number,
    price: number = 2500,
    capacity: number = 3,
    available: boolean = true
  ) {
    super(id, roomNumber, floor, price, capacity, available);
  }

  get type(): string {
    return 'Standard';
  }

  get features(): { [key: string]: boolean } {
    return {
      workDesk: true,
      freeWifi: true,
      flatScreenTv: true,
      coffeeMaker: true
    };
  }
}

export class DeluxeRoom extends Room {
  constructor(
    id: number,
    roomNumber: string,
    floor: number,
    price: number = 4000,
    capacity: number = 5,
    available: boolean = true
  ) {
    super(id, roomNumber, floor, price, capacity, available);
  }


  get type(): string {
    return 'Deluxe';
  }

  get features(): { [key: string]: boolean } {
    return {
      premiumBedding: true,
      miniBar: true,
      enhancedWiFi: true,
      luxuryBathroom: true,
      privateBalcony: true,
      roomService: true,
      smartTv: true
    };
  }
}