import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AddressSection from "./components/AddressSection";
import { Button } from 'primereact/button';

import { formatCurrency } from "@/app/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      orders: {
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      reviews: {
        include: {
          product: true
        }
      }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-24 h-24 rounded-full mb-4 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="far fa-user text-3xl text-gray-400"></i>
                </div>
              )}
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            
            <nav className="space-y-1">
              <a href="#orders" className="block px-4 py-2 rounded-md bg-gray-50 text-black font-medium">
                Order History
              </a>
              <a href="#addresses" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                Addresses
              </a>
              <a href="#reviews" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                My Reviews
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          
          {/* Orders Section */}
          <section id="orders" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display font-bold mb-6">Order History </h2>
            {user.orders.length === 0 ? (
              <p className="text-gray-500">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-6">
                {user.orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(Number(order.totalAmount))}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                            {item.variant.product.images[0] && (
                              <img src={item.variant.product.images[0]} alt={item.variant.product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.variant.product.name}</h4>
                            <p className="text-sm text-gray-500">{item.variant.volume}ml x {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(Number(item.price))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Addresses Section */}
          <AddressSection addresses={user.addresses} />

          {/* Reviews Section */}
          <section id="reviews" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display font-bold mb-6">My Reviews</h2>
            {user.reviews.length === 0 ? (
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {user.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {review.product.images[0] && (
                          <img src={review.product.images[0]} alt={review.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{review.product.name}</h4>
                        <div className="flex text-amber-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < review.rating ? "fas fa-star" : "far fa-star"}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                    <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                      <span>Longevity: {review.longevity}/5</span>
                      <span>Sillage: {review.sillage}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
