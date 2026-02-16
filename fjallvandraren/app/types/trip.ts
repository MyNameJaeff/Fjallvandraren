export interface TripImage {
  imageAlt: string;
  imageSrc: string;
  imageDescription: string;
}

export interface Trip {
  id: number;
  date: string;
  location: string;
  shortDescription: string;
  description: string;
  images: TripImage[];
}

export interface TripsData {
  Trips: Trip[];
}
