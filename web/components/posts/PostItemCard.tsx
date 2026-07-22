import React from 'react';
import { Post, PostType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const TYPE_LABELS: Record<PostType, string> = {
  ItemAvailable: 'Item Available',
  PickupRequest: 'ASAP Pickup',
};

export interface PostItemCardProps {
  post: Post;
  isOwner: boolean;
  isFavorited: boolean;
  token: string | null;
  onToggleFavorite: (post: Post) => void;
  onAccept: (postId: string) => void;
}

export function PostItemCard({
  post,
  isOwner,
  isFavorited,
  token,
  onToggleFavorite,
  onAccept,
}: PostItemCardProps) {
  const isAccepted = post.status === 'Accepted';

  return (
    <Card className="flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Badge variant={post.type === 'ItemAvailable' ? 'purple' : 'amber'}>
            {TYPE_LABELS[post.type]}
          </Badge>

          {token && (
            <button
              onClick={() => onToggleFavorite(post)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title={isFavorited ? 'Remove from saved' : 'Save post'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 ${isFavorited ? 'text-rose-600' : 'text-slate-400'}`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-3">
          <h3 className="text-lg font-bold text-foreground tracking-tight font-serif">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}
        </div>

        {/* Route */}
        <div className="mt-4 p-3 bg-background rounded-xl flex items-center justify-between text-xs font-semibold text-foreground border border-border">
          <div className="space-y-0.5">
            <span className="block text-[10px] text-primary uppercase font-bold">Pickup</span>
            <span>{post.pickupArea}</span>
          </div>
          <div className="text-primary px-2 font-light text-base">➔</div>
          <div className="space-y-0.5 text-right">
            <span className="block text-[10px] text-primary uppercase font-bold">Dropoff</span>
            <span>{post.dropoffArea}</span>
          </div>
        </div>

        {/* Metrics */}
        {(post.lengthCm || post.widthCm || post.heightCm || post.weightKg) && (
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
            {(post.lengthCm || post.widthCm || post.heightCm) && (
              <span className="bg-background rounded-md px-2 py-0.5 border border-border">
                Size: {post.lengthCm ?? '?'}×{post.widthCm ?? '?'}×{post.heightCm ?? '?'} cm
              </span>
            )}
            {post.weightKg != null && (
              <span className="bg-background rounded-md px-2 py-0.5 border border-border">
                Weight: {post.weightKg} kg
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 font-medium">
          Posted by <span className="font-semibold text-foreground">{post.ownerDisplayName}</span>
        </div>

        <div className="flex items-center gap-3">
          {post.priceOffered != null && (
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-lg px-2.5 py-1">
              €{post.priceOffered}
            </span>
          )}

          {isAccepted ? (
            <Badge variant="amber">Accepted</Badge>
          ) : isOwner ? (
            <Badge variant="slate">Your post</Badge>
          ) : token ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAccept(post.id)}
            >
              Accept Delivery
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
