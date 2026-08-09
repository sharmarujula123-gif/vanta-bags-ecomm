import Category from "../models/Category.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    return res.status(409).json({
      success: false,
      message: "Category already exists",
    });
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
  });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: {
      category,
    },
  });
};

export const getCategories = async (req, res) => {
  const categories = await Category.find({
    isActive: true,
  }).sort({ name: 1 });

  return res.status(200).json({
    success: true,
    data: {
      categories,
    },
  });
};

export const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      category,
    },
  });
};