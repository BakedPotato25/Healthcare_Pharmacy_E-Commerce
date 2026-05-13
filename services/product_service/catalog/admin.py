from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "sort_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "brand", "price", "stock", "is_active")
    list_filter = ("category", "brand", "is_active")
    search_fields = ("name", "brand")
    prepopulated_fields = {"slug": ("name",)}

