import asyncHandler from "express-async-handler"
import Category from "../models/Category.js"

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.getActiveCategories()
  res.json(categories)
})

// @desc    Get categories with blog counts
// @route   GET /api/categories/with-counts
// @access  Public
const getCategoriesWithCounts = asyncHandler(async (req, res) => {
  const categories = await Category.getCategoriesWithCounts()
  res.json(categories)
})

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('subcategories')

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
})

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate('subcategories')

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
})

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    color, 
    icon, 
    parentCategory, 
    order 
  } = req.body

  // Check if category already exists
  const categoryExists = await Category.findOne({ name })

  if (categoryExists) {
    res.status(400)
    throw new Error("Category already exists")
  }

  // Validate parent category if provided
  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory)
    if (!parentExists) {
      res.status(404)
      throw new Error("Parent category not found")
    }
  }

  const category = await Category.create({
    name,
    description,
    color,
    icon,
    parentCategory: parentCategory || null,
    order: order || 0
  })

  res.status(201).json(category)
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    color, 
    icon, 
    parentCategory, 
    order, 
    isActive 
  } = req.body

  const category = await Category.findById(req.params.id)

  if (category) {
    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const nameExists = await Category.findOne({ name })
      if (nameExists) {
        res.status(400)
        throw new Error("Category name already exists")
      }
    }

    // Validate parent category if provided
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      const parentExists = await Category.findById(parentCategory)
      if (!parentExists) {
        res.status(404)
        throw new Error("Parent category not found")
      }
      
      // Prevent circular reference
      if (parentCategory === req.params.id) {
        res.status(400)
        throw new Error("Category cannot be parent of itself")
      }
    }

    category.name = name || category.name
    category.description = description || category.description
    category.color = color || category.color
    category.icon = icon || category.icon
    category.parentCategory = parentCategory || category.parentCategory
    category.order = order !== undefined ? order : category.order
    category.isActive = isActive !== undefined ? isActive : category.isActive

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    // Check if category has blogs
    const blogCount = await category.populate('blogCount')
    if (blogCount > 0) {
      res.status(400)
      throw new Error("Cannot delete category with associated blogs")
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: req.params.id })
    if (subcategories.length > 0) {
      res.status(400)
      throw new Error("Cannot delete category with subcategories")
    }

    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: "Category removed" })
  } else {
    res.status(404)
    throw new Error("Category not found")
  }
})

// @desc    Get all categories (admin view)
// @route   GET /api/categories/admin/all
// @access  Private/Admin
const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .populate('parentCategory', 'name')
    .populate('subcategories')
    .sort({ order: 1, name: 1 })

  res.json(categories)
})

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
const reorderCategories = asyncHandler(async (req, res) => {
  const { categories } = req.body // Array of { id, order }

  if (!Array.isArray(categories)) {
    res.status(400)
    throw new Error("Categories must be an array")
  }

  const updatePromises = categories.map(({ id, order }) =>
    Category.findByIdAndUpdate(id, { order }, { new: true })
  )

  await Promise.all(updatePromises)

  const updatedCategories = await Category.find({})
    .sort({ order: 1, name: 1 })

  res.json({
    message: "Categories reordered successfully",
    categories: updatedCategories
  })
})

export {
  getCategories,
  getCategoriesWithCounts,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesAdmin,
  reorderCategories
}