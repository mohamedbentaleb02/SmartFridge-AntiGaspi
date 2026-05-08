const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { specs, swaggerUi } = require('./config/swagger');
const notificationService = require('./utils/notificationService');

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.json({
    message: 'SmartFridge AntiGaspi API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/fridge', require('./routes/fridge'));
app.use('/api/vision', require('./routes/vision'));
app.use('/api/ai-recipes', require('./routes/ai-recipes'));
app.use('/api/community', require('./routes/community'));

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    notificationService.start();
  });
}

module.exports = app;