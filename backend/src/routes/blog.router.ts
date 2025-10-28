import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono , Context} from "hono";
import { setPrisma } from "../middlewares/prisma.middleware";
import {createBlogInput,updateBlogInput} from "@mubashir2910/medium-common"

export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string
  }
}>();

//post blog
blogRouter.post('/blog',async(c:Context)=>{
  const prisma = c.get('prisma')
  const userId = c.get('userId');
  const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({message:"Inputs are incorrect"});
    }
  try{
    const post = await prisma.post.create({
      data:{
        title: body.title,
        content: body.content,
        authorId: userId
      }
    })
    return c.json({id:post.id})
  }catch(err){
    console.error(err);
    return c.json({error: "Error publishing post"},500)
  }
})

//update blog
blogRouter.put('/blog',async(c:Context)=>{
  const prisma = c.get('prisma');
  const userId = c.get('userId');

  const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({message:"Inputs are incorrect"});
    }
  try{  
    const postUpdate = await prisma.post.update({
      where:{
        id: body.id
      },
      data:{
        title: body.title,
        content: body.content,
      }
    })
    return c.json({id:postUpdate.id})
  }catch(err){
    console.error(err);
    return c.json({error:"Error while updating post"},500)
  }
})

//This Lifting was necessary bcz below is /:id and router was thing bulk is the id
blogRouter.get('/blog/bulk',async(c:Context)=>{
  const prisma = c.get('prisma');
  console.log(prisma);
  console.log("Inside blog/bulk handler");

  const posts = await prisma.post.findMany();

  return c.json({posts});
})

blogRouter.get('/blog/:id',async(c:Context)=>{
  const id = c.req.param("id");
  const prisma = c.get('prisma');

  try{
    const blog = await prisma.post.findFirst({
    where:{
      id:id
    }
  })
  return c.json({blog})
  }catch(err){
    console.error(err);
    return c.json({error:"Error while fetching post"},500)
  }
})




