const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.MONGODB_URI = 'mongodb://database/mean-docker';
} 