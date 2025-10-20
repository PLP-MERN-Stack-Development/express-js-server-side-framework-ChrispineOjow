

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

export const validateCreateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!isNonEmptyString(name)) errors.push('name is required and must be a non-empty string');
  if (!isNonEmptyString(description)) errors.push('description is required and must be a non-empty string');

  if (price === undefined || price === null || price === '') {
    errors.push('price is required');
  } else if (typeof price !== 'number') {
    // attempt to coerce numeric strings to number
    const coerced = Number(price);
    if (Number.isNaN(coerced)) {
      errors.push('price must be a number');
    } else {
      req.body.price = coerced;
    }
  } else if (price < 0) {
    errors.push('price must be >= 0');
  }

  if (!isNonEmptyString(category)) errors.push('category is required and must be a non-empty string');

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    // try to coerce common truthy/falsey strings
    if (inStock === 'true') req.body.inStock = true;
    else if (inStock === 'false') req.body.inStock = false;
    else errors.push('inStock must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({ status: 'fail', errors });
  }

  next();
};

export const validateUpdateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (name !== undefined && !isNonEmptyString(name)) errors.push('name must be a non-empty string');
  if (description !== undefined && !isNonEmptyString(description)) errors.push('description must be a non-empty string');

  if (price !== undefined) {
    if (typeof price !== 'number') {
      const coerced = Number(price);
      if (Number.isNaN(coerced)) errors.push('price must be a number');
      else req.body.price = coerced;
    } else if (price < 0) {
      errors.push('price must be >= 0');
    }
  }

  if (category !== undefined && !isNonEmptyString(category)) errors.push('category must be a non-empty string');

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    if (inStock === 'true') req.body.inStock = true;
    else if (inStock === 'false') req.body.inStock = false;
    else errors.push('inStock must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({ status: 'fail', errors });
  }

  // If no fields were provided, reject the update
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ status: 'fail', errors: ['request body is empty'] });
  }

  next();
};

export default { validateCreateProduct, validateUpdateProduct };
