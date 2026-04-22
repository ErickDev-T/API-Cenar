import Configuration from "../models/ConfigurationModel.js";

// GET /api/configurations
export const getConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find().lean();

    return res.status(200).json({
      success: true,
      data: configurations
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error getting configurations"
    });
  }
};

// GET /api/configurations/:key
export const getConfigurationByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const configuration = await Configuration.findOne({
      key: key.toUpperCase()
    }).lean();

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: configuration
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error getting configuration"
    });
  }
};

// PUT /api/configurations/:key
export const updateConfiguration = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const normalizedKey = key.toUpperCase();

    const configuration = await Configuration.findOne({
      key: normalizedKey
    });

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found"
      });
    }

    // Validaciones específicas por tipo de configuración
    if (normalizedKey === "ITBIS") {
      const numericValue = Number(value);

      if (isNaN(numericValue)) {
        return res.status(400).json({
          success: false,
          message: "ITBIS value must be numeric"
        });
      }

      if (numericValue < 0 || numericValue > 100) {
        return res.status(400).json({
          success: false,
          message: "ITBIS must be between 0 and 100"
        });
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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error updating configuration"
    });
  }
};