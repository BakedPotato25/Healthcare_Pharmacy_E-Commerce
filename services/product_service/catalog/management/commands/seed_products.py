from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Category, Product


CATEGORIES = [
    (
        "OTC Medicine",
        "Non-prescription wellness products for common self-care needs. Always read product labels and ask a pharmacist when unsure.",
    ),
    (
        "Digestive Health",
        "General digestive wellness products such as probiotics, fiber, and oral rehydration options.",
    ),
    (
        "Vitamins & Minerals",
        "Supplement products for general wellness support. These products are not a substitute for a balanced diet.",
    ),
    (
        "Mother & Baby",
        "Everyday care products for parents, infants, and young children, focused on comfort and routine care.",
    ),
    (
        "Personal Care",
        "Daily hygiene and self-care products for home healthcare routines.",
    ),
    (
        "Medical Devices",
        "Home-use monitoring and support devices for general health tracking and comfort.",
    ),
    (
        "First Aid",
        "Basic first aid supplies for minor cuts, scrapes, and home care kits.",
    ),
    (
        "Skincare",
        "Skin cleansing, moisturizing, and sun-care products for general daily care.",
    ),
    (
        "Oral Care",
        "Toothbrushes, toothpaste, floss, and mouth care items for daily oral hygiene.",
    ),
    (
        "Nutrition & Health Food",
        "General nutrition and health food products for balanced everyday routines.",
    ),
]


PRODUCTS_BY_CATEGORY = {
    "OTC Medicine": [
        ("Comfort Relief Tablets", "PharmaCare", "Non-prescription tablets for general self-care routines.", "6.99", 120),
        ("Everyday Cold Care Capsules", "MediWell", "OTC capsules for customers browsing seasonal wellness products.", "8.49", 90),
        ("Gentle Throat Lozenges", "CarePlus", "Soothing lozenges for general throat comfort.", "4.25", 150),
        ("Cooling Vapor Rub", "HealthNest", "Topical rub for comfort-focused home care.", "5.75", 80),
        ("Saline Nasal Spray", "ClearAir", "Drug-free saline spray for nasal moisture and rinsing.", "7.10", 110),
        ("Digital Fever Strips", "TempEase", "Single-use temperature strips for basic home checks.", "3.95", 75),
        ("Non-Drowsy Allergy Tablets", "AllerEase", "OTC allergy support product for label-directed use.", "9.80", 70),
        ("Children Comfort Syrup", "KidCare", "Pediatric OTC comfort product for caregiver-managed routines.", "7.65", 65),
        ("Heat Therapy Patches", "FlexiCare", "Single-use warming patches for comfort and relaxation.", "6.40", 95),
        ("Electrolyte Sachets", "HydraDay", "Powder sachets for hydration support during daily routines.", "5.90", 130),
    ],
    "Digestive Health": [
        ("Daily Probiotic Capsules", "GutBalance", "General probiotic supplement for digestive wellness routines.", "14.99", 85),
        ("Fiber Blend Powder", "NutriFiber", "Mixable fiber powder for everyday nutrition support.", "12.50", 70),
        ("Oral Rehydration Salts", "HydraCare", "Electrolyte sachets for hydration support.", "4.80", 140),
        ("Digestive Enzyme Tablets", "DigestEase", "Supplement tablets for general digestive support.", "11.25", 80),
        ("Peppermint Comfort Tea", "HerbalWell", "Herbal tea for a gentle after-meal routine.", "6.75", 95),
        ("Ginger Chew Packs", "NatureBite", "Ginger-flavored chews for travel and daily comfort.", "5.30", 100),
        ("Prebiotic Fiber Gummies", "GutBalance", "Prebiotic gummies for general wellness routines.", "10.40", 90),
        ("Hydration Ready Drink", "HydraDay", "Ready-to-drink electrolyte beverage for hydration support.", "3.60", 160),
        ("Sensitive Stomach Tea", "HerbalWell", "Caffeine-free tea blend for gentle daily use.", "7.20", 75),
        ("Digestive Wellness Kit", "PharmaCare", "Bundle of general digestive health products for home use.", "18.95", 45),
    ],
    "Vitamins & Minerals": [
        ("Vitamin C Chewables", "VitaCore", "Chewable vitamin C supplement for general wellness.", "8.99", 120),
        ("Daily Multivitamin Tablets", "VitaCore", "Multivitamin product for adult daily routines.", "13.75", 100),
        ("Vitamin D3 Softgels", "SunWell", "Vitamin D supplement for general wellness support.", "10.95", 90),
        ("Calcium Plus Tablets", "BoneCare", "Calcium supplement with general bone health positioning.", "12.20", 85),
        ("Magnesium Capsules", "MineralPlus", "Magnesium supplement for label-directed use.", "11.80", 75),
        ("Iron Support Tablets", "MineralPlus", "Iron supplement for customers advised to use iron products.", "9.70", 65),
        ("Zinc Wellness Lozenges", "VitaCore", "Zinc supplement lozenges for general wellness routines.", "6.50", 115),
        ("B-Complex Tablets", "EnergyWell", "B vitamin complex for everyday supplement routines.", "10.30", 95),
        ("Kids Multivitamin Gummies", "KidVita", "Children's multivitamin gummies for caregiver-managed use.", "9.25", 105),
        ("Omega-3 Softgels", "HeartWise", "Omega-3 supplement for general nutrition support.", "15.60", 80),
    ],
    "Mother & Baby": [
        ("Baby Gentle Wash", "TinyCare", "Mild baby wash for routine bath time.", "7.99", 90),
        ("Baby Moisture Lotion", "TinyCare", "Gentle lotion for daily baby skincare routines.", "8.50", 85),
        ("Diaper Rash Cream", "BabyShield", "Barrier cream for caregiver-managed diaper care.", "6.75", 110),
        ("Infant Nasal Aspirator", "CareBaby", "Manual aspirator for caregiver use.", "9.40", 70),
        ("Baby Wipes Sensitive", "TinyCare", "Fragrance-free wipes for routine cleaning.", "4.95", 200),
        ("Nursing Pads Pack", "MamaCare", "Disposable nursing pads for daily parent care.", "6.20", 95),
        ("Baby Thermometer", "TempEase", "Digital thermometer for basic home temperature checks.", "12.80", 60),
        ("Bottle Cleaning Brush", "CareBaby", "Bottle brush for feeding accessory cleaning.", "5.40", 80),
        ("Toddler Toothbrush Set", "TinySmile", "Soft toothbrush set for toddler oral care routines.", "4.60", 100),
        ("Baby Care Starter Kit", "MamaCare", "Starter bundle of routine baby care essentials.", "21.90", 35),
    ],
    "Personal Care": [
        ("Antibacterial Hand Gel", "CleanGuard", "Hand hygiene gel for daily personal care.", "3.99", 180),
        ("Gentle Hand Wash", "CleanGuard", "Mild liquid soap for frequent hand washing.", "4.50", 150),
        ("Cotton Buds Pack", "PureCare", "Cotton buds for general personal care use.", "2.80", 220),
        ("Body Cleansing Wipes", "FreshEase", "Disposable cleansing wipes for travel and daily routines.", "5.25", 120),
        ("Deodorant Roll-On", "FreshEase", "Daily deodorant product for personal care.", "4.90", 100),
        ("Sensitive Shaving Gel", "SmoothCare", "Shaving gel for sensitive skin routines.", "6.35", 80),
        ("Disposable Face Masks", "CleanGuard", "General protective face masks for daily settings.", "7.75", 160),
        ("Moisturizing Body Wash", "PureCare", "Body wash for routine cleansing.", "6.80", 90),
        ("Travel Hygiene Kit", "PharmaCare", "Compact personal hygiene bundle for travel.", "11.99", 55),
        ("Hand Cream Tube", "SoftHands", "Moisturizing hand cream for daily comfort.", "4.25", 130),
    ],
    "Medical Devices": [
        ("Digital Blood Pressure Monitor", "HomeMed", "Home-use monitor for general blood pressure tracking.", "42.99", 35),
        ("Pulse Oximeter", "HomeMed", "Finger pulse oximeter for general wellness monitoring.", "28.50", 45),
        ("Digital Thermometer", "TempEase", "Digital thermometer for home temperature checks.", "9.99", 100),
        ("Reusable Hot Cold Pack", "FlexiCare", "Reusable pack for hot or cold comfort routines.", "8.20", 85),
        ("Adjustable Wrist Support", "FlexiCare", "Support wrap for general wrist comfort.", "12.75", 60),
        ("Nebulizer Accessory Kit", "BreatheWell", "Replacement accessory kit for compatible home devices.", "16.40", 40),
        ("Weekly Pill Organizer", "MediSort", "Organizer box for medication schedule management.", "5.95", 110),
        ("Walking Cane Grip", "MobilityCare", "Comfort grip accessory for compatible walking canes.", "7.60", 50),
        ("Digital Weighing Scale", "HomeMed", "Home scale for general body weight tracking.", "24.30", 55),
        ("First Response Timer", "CareTools", "Digital timer for home care routines.", "6.90", 75),
    ],
    "First Aid": [
        ("Adhesive Bandage Pack", "FirstCare", "Assorted bandages for minor cuts and scrapes.", "3.75", 240),
        ("Sterile Gauze Pads", "FirstCare", "Sterile gauze pads for basic first aid kits.", "4.80", 180),
        ("Medical Tape Roll", "CareTape", "Medical tape for securing dressings.", "2.90", 160),
        ("Antiseptic Wipes", "CleanGuard", "Antiseptic wipes for basic first aid cleaning.", "3.95", 210),
        ("Elastic Bandage Wrap", "FlexiCare", "Elastic wrap for general support and first aid kits.", "5.50", 120),
        ("Instant Cold Pack", "FirstCare", "Single-use cold pack for first aid comfort.", "4.70", 100),
        ("Tweezers and Scissors Set", "CareTools", "Basic tools for home first aid kits.", "6.40", 70),
        ("Burn Gel Sachets", "CoolAid", "Cooling gel sachets for minor home first aid use.", "5.90", 90),
        ("First Aid Box", "FirstCare", "Empty organizer box for first aid supplies.", "9.85", 65),
        ("Complete First Aid Kit", "FirstCare", "Assorted basic first aid supplies for home or travel.", "19.95", 50),
    ],
    "Skincare": [
        ("Daily Moisturizing Cream", "DermaSoft", "Moisturizer for everyday skincare routines.", "9.99", 110),
        ("Gentle Facial Cleanser", "DermaSoft", "Mild cleanser for routine face washing.", "8.75", 100),
        ("SPF 50 Sunscreen Lotion", "SunCare", "Broad-spectrum sunscreen for label-directed use.", "12.60", 95),
        ("Aloe Vera Gel", "NatureSkin", "Cooling aloe gel for general skin comfort.", "6.80", 130),
        ("Lip Balm SPF", "SunCare", "Lip balm with sun protection for daily care.", "3.90", 160),
        ("Sensitive Skin Lotion", "DermaCalm", "Fragrance-free lotion for sensitive skin routines.", "10.45", 80),
        ("Hydrating Face Mist", "NatureSkin", "Face mist for refreshing skincare routines.", "7.25", 75),
        ("Barrier Repair Cream", "DermaCalm", "Moisturizing cream for dry skin care routines.", "11.35", 70),
        ("Hand Repair Balm", "SoftHands", "Rich balm for dry hand comfort.", "5.95", 120),
        ("Skincare Travel Set", "DermaSoft", "Travel-size daily skincare essentials.", "14.90", 55),
    ],
    "Oral Care": [
        ("Soft Toothbrush Duo", "SmileCare", "Soft toothbrush set for daily oral hygiene.", "4.50", 160),
        ("Fluoride Toothpaste", "SmileCare", "Toothpaste for routine brushing.", "5.20", 150),
        ("Alcohol-Free Mouthwash", "FreshMouth", "Mouthwash for daily oral care routines.", "6.75", 110),
        ("Dental Floss Picks", "FreshMouth", "Floss picks for interdental cleaning.", "3.60", 180),
        ("Sensitive Toothpaste", "GentleSmile", "Toothpaste for sensitive oral care routines.", "6.95", 100),
        ("Tongue Cleaner", "SmileCare", "Tongue cleaner for daily oral hygiene.", "3.25", 130),
        ("Kids Toothpaste", "TinySmile", "Children's toothpaste for caregiver-supervised brushing.", "4.80", 120),
        ("Orthodontic Wax", "CareDental", "Wax for comfort with orthodontic appliances.", "2.95", 90),
        ("Denture Cleaning Tablets", "CareDental", "Cleaning tablets for denture care routines.", "7.40", 80),
        ("Oral Care Travel Kit", "FreshMouth", "Compact toothbrush, toothpaste, and floss kit.", "8.60", 75),
    ],
    "Nutrition & Health Food": [
        ("Protein Shake Vanilla", "NutriLife", "Ready-to-drink protein shake for nutrition routines.", "3.99", 140),
        ("High Fiber Snack Bars", "NutriLife", "Snack bars with fiber for everyday nutrition.", "6.95", 110),
        ("Low Sugar Granola", "DailyFuel", "Granola blend for breakfast and snack routines.", "7.80", 85),
        ("Meal Replacement Powder", "DailyFuel", "Nutrition powder for occasional meal replacement use.", "18.50", 60),
        ("Herbal Wellness Tea", "HerbalWell", "Caffeine-free tea for daily wellness routines.", "5.75", 115),
        ("Electrolyte Sports Drink", "HydraDay", "Electrolyte drink for hydration support.", "2.95", 180),
        ("Oat Nutrition Drink", "NutriLife", "Oat-based nutrition drink for daily routines.", "4.20", 120),
        ("Mixed Nuts Portion Pack", "DailyFuel", "Portion packs of mixed nuts for snacking.", "8.40", 90),
        ("Chia Seed Pouch", "NatureBite", "Chia seeds for adding to meals and drinks.", "6.30", 100),
        ("Nutrition Starter Bundle", "PharmaCare", "Bundle of general nutrition products for everyday use.", "22.75", 40),
    ],
}


class Command(BaseCommand):
    help = "Seed 10 healthcare categories and 100 pharmacy e-commerce products."

    @transaction.atomic
    def handle(self, *args, **options):
        categories = {}

        for sort_order, (name, description) in enumerate(CATEGORIES, start=1):
            category, _ = Category.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    "name": name,
                    "description": description,
                    "image_url": f"https://example.com/images/categories/{slugify(name)}.jpg",
                    "sort_order": sort_order,
                    "is_active": True,
                },
            )
            categories[name] = category

        product_count = 0
        for category_name, products in PRODUCTS_BY_CATEGORY.items():
            category = categories[category_name]
            for index, (name, brand, description, price, stock) in enumerate(products, start=1):
                Product.objects.update_or_create(
                    slug=slugify(name),
                    defaults={
                        "category": category,
                        "name": name,
                        "brand": brand,
                        "description": description,
                        "price": Decimal(price),
                        "stock": stock,
                        "image_url": f"https://example.com/images/products/{slugify(name)}.jpg",
                        "is_active": True,
                    },
                )
                product_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(CATEGORIES)} categories and {product_count} products."
            )
        )
