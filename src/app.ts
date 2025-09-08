import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://medimart-self.vercel.app',
      'https://medimart-store.vercel.app',
      'https://www.medimart-store.xyz',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Authorization, Origin, X-Requested-With, Accept',
    credentials: true,
  }),
);

// application routes
app.use('/api/v1', router);

//global error handler
app.use(globalErrorHandler);

// handle not found routes
app.use(notFound);

export default app;
