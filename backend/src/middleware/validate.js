import { sendError } from '../utils/response.js';

// Validates req.body against a Zod schema.
// Usage: router.post('/route', validate(mySchema), controller)
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return sendError(res, 'Validation failed', 422, errors);
  }
  req.body = result.data; // replace with parsed + coerced data
  next();
};
