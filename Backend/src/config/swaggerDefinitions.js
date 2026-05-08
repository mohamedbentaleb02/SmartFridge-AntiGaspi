const swaggerDefinitions = {
  // AUTH ENDPOINTS
  '/api/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Authentication'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password', 'firstName', 'lastName'],
              properties: {
                username: { type: 'string', example: 'john_doe' },
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'password123' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'User registered successfully' },
        400: { description: 'User already exists or validation error' }
      }
    }
  },
  '/api/auth/login': {
    post: {
      summary: 'Login user',
      tags: ['Authentication'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'password123' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Login successful' },
        401: { description: 'Invalid credentials' }
      }
    }
  },
  '/api/auth/me': {
    get: {
      summary: 'Get current user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'User profile retrieved' },
        401: { description: 'Unauthorized' }
      }
    }
  },
  '/api/auth/profile': {
    put: {
      summary: 'Update user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                preferences: { type: 'object' },
                notifications: { type: 'object' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Profile updated successfully' },
        401: { description: 'Unauthorized' }
      }
    }
  },

  // FRIDGE ENDPOINTS
  '/api/fridge': {
    get: {
      summary: 'Get all fridge items for user',
      tags: ['Fridge'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Fridge items retrieved' },
        401: { description: 'Unauthorized' }
      }
    },
    post: {
      summary: 'Add item to fridge',
      tags: ['Fridge'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['product', 'quantity', 'unit', 'expiryDate', 'location'],
              properties: {
                product: { type: 'string', example: 'Product ID' },
                quantity: { type: 'number', example: 2 },
                unit: { type: 'string', enum: ['g', 'kg', 'ml', 'l', 'piece', 'pack'] },
                expiryDate: { type: 'string', format: 'date', example: '2026-05-15' },
                location: { type: 'string', enum: ['refrigerator', 'freezer', 'pantry', 'counter'] },
                notes: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Item added to fridge' },
        400: { description: 'Validation error' }
      }
    }
  },
  '/api/fridge/{id}': {
    get: {
      summary: 'Get single fridge item',
      tags: ['Fridge'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Fridge item retrieved' },
        404: { description: 'Item not found' }
      }
    },
    put: {
      summary: 'Update fridge item',
      tags: ['Fridge'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                quantity: { type: 'number' },
                expiryDate: { type: 'string', format: 'date' },
                status: { type: 'string', enum: ['fresh', 'expiring-soon', 'expired', 'consumed'] }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Item updated' },
        404: { description: 'Item not found' }
      }
    },
    delete: {
      summary: 'Delete fridge item',
      tags: ['Fridge'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { description: 'Item deleted' },
        404: { description: 'Item not found' }
      }
    }
  }
};

module.exports = swaggerDefinitions;