import { Hono } from 'hono'
import { auth } from './routes/auth'
import { authMiddleware } from './middleware/auth.middleware'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Referirse a la documentacion')
})

app.use("/api/*", authMiddleware)
app.route("/api/auth", auth)

export default app
