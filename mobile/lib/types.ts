// Mirrors Api/Features/Posts/PostsDtos.cs — same file as the web app's
// lib/types.ts. Kept in sync manually for now.

export type PostType = 'ItemAvailable' | 'PickupRequest';
export type PostStatus = 'Open' | 'Accepted' | 'Completed' | 'Cancelled';

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  ownerId: string;
  ownerDisplayName: string;
  title: string;
  description: string | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  weightKg: number | null;
  pickupArea: string;
  dropoffArea: string;
  priceOffered: number | null;
  acceptedByUserId: string | null;
  acceptedAt: string | null;
  createdAt: string;
}
