import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import type { Context, Next } from 'hono';

// Middleware to initialize Prisma and attach it to context
export const setPrisma = async (c: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Store prisma instance in context
  c.set('prisma', prisma);
//console.log("Inside setPrisma");
  await next();

  // Optionally disconnect after the request
  await prisma.$disconnect();
};
