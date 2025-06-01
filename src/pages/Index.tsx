
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Package, 
  Truck, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Globe,
  Zap
} from "lucide-react";

const Index = () => {
  const stats = [
    { number: "2,500+", label: "Active Pharmacies", icon: Users },
    { number: "50,000+", label: "Products Delivered", icon: Package },
    { number: "99.8%", label: "On-Time Delivery", icon: Clock },
    { number: "24/7", label: "Customer Support", icon: Shield },
  ];

  const features = [
    {
      icon: Package,
      title: "Quality Assurance",
      description: "Verified pharmaceutical products from licensed suppliers with proper certification and batch tracking.",
      color: "text-primary-600"
    },
    {
      icon: Zap,
      title: "Instant Ordering",
      description: "Quick and efficient ordering system with real-time inventory updates and smart reorder suggestions.",
      color: "text-secondary-600"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day and next-day delivery options with real-time GPS tracking and proof of delivery.",
      color: "text-success-600"
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Advanced analytics and reporting to help you make data-driven decisions for your pharmacy.",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "End-to-end encryption, secure payments, and compliance with healthcare data regulations.",
      color: "text-blue-600"
    },
    {
      icon: Globe,
      title: "Nationwide Coverage",
      description: "Comprehensive delivery network covering all major cities and remote areas across Tanzania.",
      color: "text-green-600"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Amina Hassan",
      role: "Pharmacy Owner, Dar es Salaam",
      content: "BEPAWA transformed our supply chain. We've reduced stockouts by 90% and our ordering time by 75%.",
      rating: 5
    },
    {
      name: "John Mwangi",
      role: "Operations Manager, Kilimanjaro Pharmacy",
      content: "The real-time tracking and inventory management features have been game-changers for our business.",
      rating: 5
    },
    {
      name: "Sarah Kimani",
      role: "Pharmacy Director, Arusha Medical Center",
      content: "Excellent service quality and the credit facility has helped us maintain steady cash flow.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                BEPAWA
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Medical Supply Excellence</p>
            </div>
          </div>
          <div className="space-x-3">
            <Button variant="outline" asChild className="border-primary-200 text-primary-700 hover:bg-primary-50">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-medical-pattern opacity-30"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-primary-100 text-primary-800 border-primary-200">
            🚀 Trusted by 2,500+ Pharmacies Nationwide
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Revolutionize Your
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent block mt-2">
              Medical Supply Chain
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            The most advanced B2B platform for pharmaceutical distribution in Tanzania. 
            Connect with trusted suppliers, manage inventory intelligently, and deliver excellence to your patients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 px-8 py-4 text-lg">
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary-200 text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                  <stat.icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary-200 text-primary-700">
              Platform Features
            </Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for Modern Pharmacy Operations
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From inventory management to delivery tracking, we provide comprehensive tools to streamline your business operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary-200 text-primary-700">
              Customer Success
            </Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Healthcare Professionals
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how BEPAWA is transforming pharmacy operations across Tanzania.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-3 mr-4">
                      <Users className="h-6 w-6 text-primary-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Award className="h-16 w-16 mx-auto mb-6 text-primary-100 animate-bounce-gentle" />
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of pharmacies already using BEPAWA to optimize their supply chain, 
            reduce costs, and improve patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Link to="/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
              onClick={() => {
                // Simple demo scheduling functionality
                alert("Demo scheduled! Our team will contact you within 24 hours.");
              }}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-semibold">BEPAWA</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Transforming pharmaceutical distribution across Tanzania with innovative technology and reliable service.
              </p>
              <div className="flex space-x-2">
                <CheckCircle className="h-5 w-5 text-success-500" />
                <span className="text-sm text-gray-300">Licensed & Regulated</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 BEPAWA Medical Supply Chain. All rights reserved. 
              <span className="mx-2">•</span>
              Revolutionizing healthcare distribution in Tanzania.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
