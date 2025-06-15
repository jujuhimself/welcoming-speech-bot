
import Navbar from "@/components/Navbar";
import ProductFilters from "@/components/ProductFilters";
import ProductDetails from "@/components/ProductDetails";
import ProductList from "@/components/ProductList";
import ProductViewHeader from "@/components/ProductViewHeader";
import ProductViewControls from "@/components/ProductViewControls";
import ProductEmptyState from "@/components/ProductEmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductsPage } from "@/hooks/useProductsPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <div className="container mx-auto px-4 py-4 md:py-8">
          {/* Header */}
          <ProductViewHeader />

          {/* Filters */}
          <div className="mb-6">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              categories={categories}
              totalProducts={filteredProducts.length}
            />
          </div>

          {/* View Controls */}
          <ProductViewControls
            productCount={filteredProducts.length}
            totalProducts={products.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Products Grid/List or Empty State */}
          {filteredProducts.length === 0 ? (
            <ProductEmptyState />
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
    </ErrorBoundary>
  );
};

export default Products;
