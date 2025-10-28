import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { Bindings } from 'hono/types'
import { basePath } from 'hono/route';
import { decode,sign,verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { userRouter } from './routes/user.routes';
import { blogRouter } from './routes/blog.router';
import { authMiddleware } from './middlewares/auth.middleware';
import { setPrisma } from './middlewares/prisma.middleware';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET:string
	},
  Variables:{
    userId: string
  }
}>().basePath('/api/v1');

app.get('/', (c) => c.text('Hello from Hono! 🚀'));

app.use('*',setPrisma) //MIDDLEWARE

app.route('/',userRouter);

app.use('/blog/*',authMiddleware)
app.route('/',blogRouter)

//console.log(app.routes);




export default app

