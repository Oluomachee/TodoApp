"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupuser } from "@/src/actions/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import Image from 'next/image'




export function Loginpage() {
  const router = useRouter()

  const formSchema = z.object({
    email: z.string().email().min(8, {
      message: "Input valid email",
    }),
    password: z.string().min(8, { message: "Be at least 8 characters long" }).regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' }).regex(/[0-9]/, { message: 'Contains at least one number.' }).regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' }).trim()

  })
  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)

    const response = await signupuser(values.email, values.password)
    if (response?.success) {
      toast.success(response.message)
      router.push('/')
    } else {
      toast.error(response.message)
    }

  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""

    }
  })

const loading =  form. formState.isSubmitting;

  return (
    <div className='min-h-screen bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: "url('/Background1.jpg')" }}>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:place-items-center place-items-center pt-20">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-xs ">
                <div className="place-items-center">
                  <Image className='w-36 ' src="/Avatar.png" width={200} height={200} alt="logo image" />
                  
                </div>
                <FormDescription className='text-white text-3xl text-center font-bold'>
                  Signup
                </FormDescription>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input className="text-black bg-white" type="email" placeholder="Input your email here" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-xs">
                <FormLabel className="text-white" >Password</FormLabel>
                <FormControl>
                  <Input className="text-black bg-white" type="password" placeholder="Input password here" {...field} />
                </FormControl>
                <FormDescription>

                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="place-items-center" >
            <Button type="submit" disabled={loading}>
            {loading?<Loader2 className="animate-spin"/>:"Submit"}
          </Button>
          </div>
          
          <p className="text-white" >Have an account already? <Link href={"/login"}> login here </Link></p>
        </form>
      </Form>
    </div>
  )
}
