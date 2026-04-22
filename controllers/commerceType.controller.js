import CommerceType from "../models/CommerceTypeModel.js";
import Commerce from "../models/CommerceModel.js";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import Order from "../models/OrderModel.js";
import Favorite from "../models/FavoriteModel.js";

// GET /api/admin/commerce-types
export const getCommerceTypes = async (req, res, next) => {
  try {
    const commerceTypes = await CommerceType.find().lean();

    return res.status(200).json({
      success: true,
      data: commerceTypes
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/commerce-types/:id
export const getCommerceTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const commerceType = await CommerceType.findById(id).lean();

    if (!commerceType) {
      const error = new Error("Commerce type not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: commerceType
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/commerce-types
export const createCommerceType = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      const error = new Error("Name is required");
      error.statusCode = 400;
      return next(error);
    }

    if (!req.file) {
      const error = new Error("Icon is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingCommerceType = await CommerceType.findOne({
      name: name.trim()
    });

    if (existingCommerceType) {
      const error = new Error("Commerce type already exists");
      error.statusCode = 400;
      return next(error);
    }

    const commerceType = await CommerceType.create({
      name: name.trim(),
      icon: req.file.path
    });

    return res.status(201).json({
      success: true,
      message: "Commerce type created successfully",
      data: commerceType
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/commerce-types/:id
export const updateCommerceType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const commerceType = await CommerceType.findById(id);

    if (!commerceType) {
      const error = new Error("Commerce type not found");
      error.statusCode = 404;
      return next(error);
    }

    if (name?.trim()) {
      const duplicated = await CommerceType.findOne({
        name: name.trim(),
        _id: { $ne: id }
      });

      if (duplicated) {
        const error = new Error("Commerce type already exists");
        error.statusCode = 400;
        return next(error);
      }

      commerceType.name = name.trim();
    }

    if (req.file) {
      commerceType.icon = req.file.path;
    }

    await commerceType.save();

    return res.status(200).json({
      success: true,
      message: "Commerce type updated successfully",
      data: commerceType
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/commerce-types/:id
export const deleteCommerceType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const commerceType = await CommerceType.findById(id);

    if (!commerceType) {
      const error = new Error("Commerce type not found");
      error.statusCode = 404;
      return next(error);
    }

    const commerces = await Commerce.find({ commerceType: id }).lean();
    const commerceIds = commerces.map(c => c._id);

    await Favorite.deleteMany({ commerce: { $in: commerceIds } });
    await Order.deleteMany({ commerce: { $in: commerceIds } });
    await Product.deleteMany({ commerce: { $in: commerceIds } });
    await Category.deleteMany({ commerce: { $in: commerceIds } });
    await Commerce.deleteMany({ _id: { $in: commerceIds } });
    await CommerceType.findByIdAndDelete(id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};