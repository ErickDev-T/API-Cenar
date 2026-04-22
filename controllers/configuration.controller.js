import Configuration from "../models/ConfigurationModel.js";

// GET /api/configurations
export const getConfigurations = async (req, res, next) => {
  try {
    let itbisConfiguration = await Configuration.findOne({
      key: "ITBIS"
    });

    if (!itbisConfiguration) {
      itbisConfiguration = await Configuration.create({
        key: "ITBIS",
        value: "18"
      });
    }

    const configurations = await Configuration.find().lean();

    return res.status(200).json({
      success: true,
      data: configurations
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/configurations/:key
export const getConfigurationByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const normalizedKey = key.toUpperCase();

    let configuration = await Configuration.findOne({
      key: normalizedKey
    }).lean();

    if (!configuration && normalizedKey === "ITBIS") {
      configuration = await Configuration.create({
        key: "ITBIS",
        value: "18"
      });

      configuration = configuration.toObject();
    }

    if (!configuration) {
      const error = new Error("Configuration not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: configuration
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/configurations/:key
export const updateConfiguration = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const normalizedKey = key.toUpperCase();

    let configuration = await Configuration.findOne({
      key: normalizedKey
    });

    if (!configuration && normalizedKey === "ITBIS") {
      configuration = await Configuration.create({
        key: "ITBIS",
        value: "18"
      });
    }

    if (!configuration) {
      const error = new Error("Configuration not found");
      error.statusCode = 404;
      return next(error);
    }

    if (normalizedKey === "ITBIS") {
      const numericValue = Number(value);

      if (isNaN(numericValue)) {
        const error = new Error("ITBIS value must be numeric");
        error.statusCode = 400;
        return next(error);
      }

      if (numericValue < 0 || numericValue > 100) {
        const error = new Error("ITBIS must be between 0 and 100");
        error.statusCode = 400;
        return next(error);
      }
    }

    configuration.value = value;

    await configuration.save();

    return res.status(200).json({
      success: true,
      message: "Configuration updated successfully",
      data: configuration
    });
  } catch (error) {
    return next(error);
  }
};