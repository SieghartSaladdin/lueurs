"use client";

import { useState } from "react";

type Review = {
  id: string;
  rating: number;
  longevity: number | null;
  sillage: number | null;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function ReviewSection({
  reviews,
  productId,
}: {
  reviews: Review[];
  productId: string;
}) {
  const [showForm, setShowForm] = useState(false);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mb-24">
      <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-display font-medium mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${
                    star <= Math.round(averageRating) ? "" : "text-gray-300"
                  }`}
                ></i>
              ))}
            </div>
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {showForm && (
        <div className="bg-stone-50 p-8 mb-12">
          <h3 className="font-display text-xl mb-6">Share your experience</h3>
          {/* Form implementation would go here, requiring authentication */}
          <p className="text-gray-500 text-sm mb-4">Please log in to write a review.</p>
        </div>
      )}

      <div className="space-y-12">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {review.user.image ? (
                      <img src={review.user.image} alt={review.user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{review.user.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex text-amber-500 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${
                        star <= review.rating ? "" : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                <div className="md:col-span-2">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
                <div className="bg-stone-50 p-4 text-sm">
                  <div className="mb-3">
                    <p className="text-gray-500 mb-1">Longevity</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full"
                        style={{ width: `${((review.longevity || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Sillage</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full"
                        style={{ width: `${((review.sillage || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
