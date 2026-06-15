// Mirrors Api/Features/Posts/PostsDtos.cs and Api/Models/Post.cs (enums).
// Keeping these in sync manually for now — a later step could generate
// these automatically from the API's OpenAPI spec.

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

export interface CreatePostRequest {
  type: PostType;
  title: string;
  description?: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg?: number;
  pickupArea: string;
  dropoffArea: string;
  priceOffered?: number;
}