export const validate = (schema) => async (req, res, next) => {
    try {
      const result = await schema.parseAsync({
        body: req.body,
        params: {},
        query: {},
      });
  
      req.body = result.body;
  
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors || error.issues || [],
      });
    }
  };