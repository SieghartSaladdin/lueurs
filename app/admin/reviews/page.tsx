"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Review = {
  id: string;
  rating: number;
  longevity: number | null;
  sillage: number | null;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  product: {
    name: string;
  };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");
      
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400 text-xs">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < rating ? "" : "text-gray-200"}`}
          ></i>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading reviews...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
          Customer Reviews
        </h1>
        <p className="text-gray-500 font-light">
          Moderate and manage product reviews from customers.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Customer
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Product
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Rating
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Comment
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Date
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">
                      {review.user.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">{review.user.email}</p>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {review.product.name}
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 w-16">Overall:</span>
                        {renderStars(review.rating)}
                      </div>
                      {review.longevity && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-16">Longevity:</span>
                          {renderStars(review.longevity)}
                        </div>
                      )}
                      {review.sillage && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-16">Sillage:</span>
                          {renderStars(review.sillage)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={review.comment || ""}>
                      {review.comment || <span className="italic text-gray-400">No comment</span>}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Review"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
