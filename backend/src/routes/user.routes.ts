import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import { Hono,Context } from "hono";
import {signupInput,signinInput} from "@mubashir2910/medium-common"

export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  }
}>();

userRouter.post('/signup', async(c:Context) => {
  const prisma = c.get('prisma');
  const body =await c.req.json();
  if(!body.email || !body.password){
    c.status(400)
    return c.json({error: "Email and Password are required!!!"})
  }
  
  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({message:"Inputs are incorrect"});
  }

  const hashedPassword = await bcrypt.hash(body.password,10);
  try{
    const user = await prisma.user.create({
      data:{
        email:body.email,
        password: hashedPassword
      }
    })
    //user.id gets generated after the above the data is created 
    const jwt = await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt,email:user.email,id:user.id}) 
   } catch (err) {
    console.error('Signup error:', err);
    return c.json({ error: (err as Error).message }, 500);
  }

})

userRouter.post('/signin', async (c:Context) => {
  const prisma = c.get('prisma');

  const body = await c.req.json();
  
  if (!body.email || !body.password) {
    c.status(400);
    return c.json({ error: "Email and password are required" });
  }
    const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({message:"Inputs are incorrect"});
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      c.status(403);
      return c.json({ error: "Invalid password" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({jwt,email:user.email,id:user.id})

  } catch (err) {
    console.error(err);
    return c.json({ error: "Signin failed" }, 500);
  }
});