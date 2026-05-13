import {
  Baby,
  Bandage,
  Bone,
  HeartPulse,
  Leaf,
  Pill,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Thermometer,
} from "lucide-react";

export const categories = [
  { name: "OTC Medicine", icon: Pill, count: 10 },
  { name: "Digestive Health", icon: Stethoscope, count: 10 },
  { name: "Vitamins & Minerals", icon: Sparkles, count: 10 },
  { name: "Mother & Baby", icon: Baby, count: 10 },
  { name: "Personal Care", icon: ShieldCheck, count: 10 },
  { name: "Medical Devices", icon: Thermometer, count: 10 },
  { name: "First Aid", icon: Bandage, count: 10 },
  { name: "Skincare", icon: Leaf, count: 10 },
  { name: "Oral Care", icon: Smile, count: 10 },
  { name: "Nutrition & Health Food", icon: Bone, count: 10 },
];

export const products = [
  {
    id: "vitamin-c-complex",
    name: "Daily Vitamin C Complex",
    brand: "PharmaCare",
    category: "Vitamins & Minerals",
    description: "Buffered vitamin C supplement with zinc for daily wellness support.",
    detail: "A gentle daily supplement option for customers looking for immune support products. Follow the product label and ask a pharmacist if you are unsure whether it fits your routine.",
    price: 18.99,
    stock: 42,
    badge: "In Stock",
    strength: "1000mg • 60 tablets",
    visual: "VC",
    accent: "bg-orange-50",
  },
  {
    id: "probiotic-balance",
    name: "Probiotic Balance Capsules",
    brand: "GutWell",
    category: "Digestive Health",
    description: "Daily probiotic capsules for general digestive wellness routines.",
    detail: "A non-prescription digestive health product designed for everyday gut flora support. It is not a treatment for persistent or severe digestive symptoms.",
    price: 24.5,
    stock: 28,
    badge: "In Stock",
    strength: "30 capsules",
    visual: "PB",
    accent: "bg-teal-50",
  },
  {
    id: "hydrating-ceramide-cream",
    name: "Hydrating Ceramide Cream",
    brand: "DermaSoft",
    category: "Skincare",
    description: "Fragrance-free moisturizer for dry and sensitive skin care routines.",
    detail: "A gentle skincare option with ceramides and glycerin. Stop use if irritation occurs and speak with a healthcare professional for ongoing skin concerns.",
    price: 16.75,
    stock: 35,
    badge: "In Stock",
    strength: "200ml jar",
    visual: "HC",
    accent: "bg-sky-50",
  },
  {
    id: "digital-thermometer",
    name: "Digital Flex Thermometer",
    brand: "MediTrack",
    category: "Medical Devices",
    description: "Flexible-tip thermometer with quick digital reading.",
    detail: "A home healthcare device for temperature monitoring. Follow the included instructions and seek professional care for severe or concerning symptoms.",
    price: 12.99,
    stock: 19,
    badge: "Low Stock",
    strength: "Water-resistant",
    visual: "DT",
    accent: "bg-slate-100",
  },
  {
    id: "first-aid-bandage-kit",
    name: "First Aid Bandage Kit",
    brand: "CareReady",
    category: "First Aid",
    description: "Assorted sterile bandages and wound care basics for home use.",
    detail: "A practical first aid kit for minor cuts and scrapes. For deep wounds, heavy bleeding, or signs of infection, contact a healthcare professional.",
    price: 14.25,
    stock: 51,
    badge: "In Stock",
    strength: "72 pieces",
    visual: "FA",
    accent: "bg-rose-50",
  },
  {
    id: "oral-care-rinse",
    name: "Alcohol-Free Oral Rinse",
    brand: "SmileGuard",
    category: "Oral Care",
    description: "Gentle fluoride mouth rinse for daily oral care.",
    detail: "A daily oral care product for routine freshness and enamel support. It does not replace dental evaluation for pain, swelling, or injury.",
    price: 8.6,
    stock: 64,
    badge: "In Stock",
    strength: "500ml bottle",
    visual: "OR",
    accent: "bg-blue-50",
  },
];

export const cartItems = [
  { ...products[0], quantity: 2 },
  { ...products[2], quantity: 1 },
];

export const orders = [
  {
    id: "ORD-8472",
    status: "processing",
    date: "May 12, 2026",
    total: 61.73,
    items: ["Daily Vitamin C Complex", "Hydrating Ceramide Cream"],
    eta: "Preparing for shipment",
  },
  {
    id: "ORD-7391",
    status: "shipped",
    date: "May 8, 2026",
    total: 38.75,
    items: ["Probiotic Balance Capsules", "Alcohol-Free Oral Rinse"],
    eta: "Expected May 15, 2026",
  },
  {
    id: "ORD-6120",
    status: "delivered",
    date: "April 28, 2026",
    total: 27.24,
    items: ["Digital Flex Thermometer", "First Aid Bandage Kit"],
    eta: "Delivered May 1, 2026",
  },
];

export const chatMessages = [
  {
    sender: "assistant",
    text: "Hello. I can help you compare general pharmacy product categories such as vitamins, skincare, first aid, oral care, and digestive health.",
  },
  {
    sender: "user",
    text: "I need something gentle for dry skin.",
  },
  {
    sender: "assistant",
    text: "For general dry-skin care, you may want to look at fragrance-free moisturizers with ceramides or glycerin. This is a general product suggestion and does not replace advice from a doctor or pharmacist.",
    recommendations: [products[2], products[4]],
  },
];

export const dashboardStats = [
  { label: "Active orders", value: "2", helper: "1 shipped today" },
  { label: "Cart items", value: "3", helper: "$55.73 subtotal" },
  { label: "Saved products", value: "8", helper: "Across 4 categories" },
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
