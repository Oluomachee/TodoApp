import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import credentials from "@auth/core/providers/credentials";
import prisma from "./lib/db";
import { hashPassword } from "./lib/utils";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [credentials({
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "email", placeholder: "Input Your valid email" },
      password: { label: "Password", type: "email", placeholder: "Input Password" }
    },
    authorize: async (credentials) => {
      const email = credentials.email as string
      const password = credentials.password as string
      if (!email || !password) {
        return null
      }
     
      let user = await prisma.user.findUnique({
        where: { email: email }
      })
      if (!user) {
        console.log('user does not exist')
        const hashedPassword = hashPassword(password) 
        user = await prisma.user.create({
          data: {email:email, passwordhash:hashedPassword}
        })
      }else {
        console.log("user exists")
        const ismatch = bcrypt.compareSync(password, user.passwordhash)
        if (!ismatch){
          return null
        }
      }
      console.log('logging in ')
       return user
      

    }
  })],
})

