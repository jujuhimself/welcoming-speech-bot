
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Grid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductFilters from "@/components/ProductFilters";
import ProductDetails from "@/components/ProductDetails";
import ProductList from "@/components/ProductList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductsPage } from "@/hooks/useProductsPage";

// Product type is re-exported from hook for local typing where needed.
const Products = () => {
  const {
    user,
    products,
    filteredProducts,
    wishlist,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    sortBy,
    setSortBy,
    selectedProduct,
    setSelectedProduct,
    showProductDetails,
    setShowProductDetails,
    handleFiltersChange,
    addToCart,
    toggleWishlist,
    openProductDetails,
    categories,
  } = useProductsPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Medical Products Catalog
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Browse our comprehensive selection of pharmaceutical products
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            categories={categories}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No products found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            viewMode={viewMode}
            wishlist={wishlist}
            onAddToCart={(product, e) => addToCart(product)}
            onToggleWishlist={(id, e) => toggleWishlist(id)}
            onViewDetails={openProductDetails}
            userRole={user?.role}
          />
        )}

        {/* Product Details Modal */}
        <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist.includes(selectedProduct.id)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Products;

