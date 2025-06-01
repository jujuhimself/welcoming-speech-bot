
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2,
  Clock,
  Shield,
  Truck,
  AlertCircle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  manufacturer?: string;
  dosage?: string;
  prescription?: boolean;
}

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductDetails = ({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState("description");

  // Mock data for expanded content
  const specifications = {
    "Active Ingredient": product.dosage ? `${product.name.split(' ')[0]} ${product.dosage}` : "N/A",
    "Manufacturer": product.manufacturer || "N/A",
    "Form": "Tablet/Capsule",
    "Pack Size": "20-30 units",
    "Storage": "Store in cool, dry place",
    "Expiry": "24 months from manufacture",
  };

  const reviews = [
    {
      id: 1,
      user: "Dr. John M.",
      rating: 5,
      comment: "Excellent quality medication. Patients respond well to this treatment.",
      date: "2024-05-15"
    },
    {
      id: 2,
      user: "Pharmacy Owner",
      rating: 4,
      comment: "Good product, reliable supplier. Fast delivery.",
      date: "2024-05-10"
    }
  ];

  const relatedProducts = [
    { id: "rel1", name: "Ibuprofen 400mg", price: 2000, image: product.image },
    { id: "rel2", name: "Aspirin 300mg", price: 1200, image: product.image },
    { id: "rel3", name: "Acetaminophen 650mg", price: 1800, image: product.image },
  ];

  return (
    <div className="space-y-6">
      {/* Main Product Info */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.prescription && (
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  Prescription Required
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.manufacturer && (
                <p className="text-lg text-gray-600">by {product.manufacturer}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                TZS {product.price.toLocaleString()}
              </span>
              <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "destructive" : "secondary"}>
                {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
              </Badge>
            </div>

            {product.dosage && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Dosage: {product.dosage}</p>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quick Info Icons */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Licensed Product</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full h-12 text-lg font-semibold"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full h-12">
                <Share2 className="h-5 w-5 mr-2" />
                Share Product
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Expandable Content Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="specifications">
              <AccordionTrigger>Specifications & Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage">
              <AccordionTrigger>Usage Instructions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Dosage</h4>
                    <p className="text-gray-600">Take as directed by healthcare professional. Follow prescription guidelines.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Administration</h4>
                    <p className="text-gray-600">Oral administration with water. Can be taken with or without food.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Warnings</h4>
                    <p className="text-gray-600 text-sm">Keep out of reach of children. Store in original packaging.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews">
              <AccordionTrigger>Reviews & Ratings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">4.5 out of 5</span>
                    <span className="text-gray-600">({reviews.length} reviews)</span>
                  </div>
                  
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-medium text-gray-800">{review.user}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Options</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Standard Delivery: 2-3 business days</li>
                      <li>• Express Delivery: Next business day</li>
                      <li>• Free shipping on orders over TZS 50,000</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Return Policy</h4>
                    <p className="text-gray-600">Returns accepted within 30 days for unopened products. Prescription medications cannot be returned.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Products */}
      <Card>
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h4 className="font-medium text-gray-800 mb-1">{relatedProduct.name}</h4>
                <p className="text-primary-600 font-semibold">TZS {relatedProduct.price.toLocaleString()}</p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Product
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
