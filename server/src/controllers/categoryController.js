import Category from "../models/category.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const createCategory = async (req, res) => {
  const { name, description, image, parentCategory } = req.body;

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

  let parent = null;

  if (parentCategory) {
    parent = await Category.findOne({
      _id: parentCategory,
      isActive: true,
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    parentCategory: parent?._id || null,
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
  })
    .populate("parentCategory", "name slug")
    .sort({ parentCategory: 1, name: 1 });

  return res.status(200).json({
    success: true,
    data: {
      categories,
    },
  });
};

export const getCategoryBySlug = async (req, res) => {
  const value = String(req.params.slug || "").trim();
  let category = null;

  if (mongoose.isValidObjectId(value)) {
    category = await Category.findOne({
      _id: value,
      isActive: true,
    }).populate("parentCategory", "name slug");
  }

  if (!category) {
    category = await Category.findOne({
      slug: value.toLowerCase(),
      isActive: true,
    }).populate("parentCategory", "name slug");
  }

  if (!category) {
    category = await Category.findOne({
      name: { $regex: new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      isActive: true,
    }).populate("parentCategory", "name slug");
  }

  if (!category) {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const candidates = [
      normalized,
      normalized.endsWith("-bags") ? normalized.slice(0, -1) : `${normalized}s`,
      normalized.endsWith("-bag") ? `${normalized}s` : normalized,
    ].filter(Boolean);

    category = await Category.findOne({
      slug: { $in: candidates },
      isActive: true,
    }).populate("parentCategory", "name slug");
  }

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
