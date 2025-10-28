import { verify } from "hono/jwt";
import { Context,Next } from "hono";

export const authMiddleware = async(c:Context,next:Next)=>{
  const jwt = c.req.header('Authorization');
  if(!jwt){
    c.status(401);
    return c.html('<h1>UNAUTHORIZED!!!</h1>')
  }

  const token = jwt.split(' ')[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if(!payload){
    c.status(401);
    return c.json({error:"Unauthorized"});
  }
  c.set('userId',payload.id);
  console.log("Inside authMiddleware");

  await next();
}

