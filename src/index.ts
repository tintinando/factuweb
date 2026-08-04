import { Hono } from 'hono';
import { auth } from './routes/auth.route';
import { authMiddleware } from './middleware/auth.middleware';
import { wsfeRecuperadorRoute } from './routes/recuperador.route';

const app = new Hono();

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message
    },
    500
  );
});

app.get('/', (c) => {
  return c.text('Referirse a la documentacion');
});

app.use('/api/*', authMiddleware);
app.route('/api/auth', auth);
app.route('/api/wsferecuperador', wsfeRecuperadorRoute);

export default app;
