'use client'
import React from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {  loginuser} from '@/src/actions/actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
export function Loguserin() {
    
   


    const router = useRouter()
    const formSchema = z.object({
        email: z.string().email().min(8, {
            message: "Input valid email",
        }),
        password: z.string().min(8, { message: "Be at least 8 characters long" }).regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' }).regex(/[0-9]/, { message: 'Contains at least one number.' }).regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' }).trim()

    })
    async function onSubmit(values: z.infer<typeof formSchema>) {



        const response = await loginuser(values.email, values.password)
        if (response?.success) {
            toast.success(response.message)
            router.push('/')
        } else {
            toast.error(response?.message)
        }
        
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""

        }

    })
    const loading =  form.formState.isSubmitting;
    return (
        <div className='min-h-screen bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: "url('/Background1.jpg')" }}>

            {/* <Image className='bg-[url(/public/Background2.jpg)]' width={500} height={500} src={"/Background2.jpg"} alt="background"/>  */}
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:place-items-center place-items-center pt-20 ">
                    <FormField
                        control={form.control}

                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-xs sm:place-items-center ">
                                <div className='sm:place-items-center'>
                                   <Image className='w-36 ' src="/Avatar.png" width={200} height={200} alt="logo image" />
                                </div>
                                <FormDescription className='text-white text-3xl text-center font-bold'>
                                    Login
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
                            <FormItem className="w-xs sm:place-items-center">
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
                   <div className='sm:place-items-center' >
                     <Button type="submit" disabled={loading}>
                        {loading?<Loader2 className='animate-spin'/>:"Submit"}
                        </Button>
                   </div>
                    <p className="text-white" >Don&apos;t have an account yet? <Link href={"/signup"}> Signup here </Link></p>


                </form>
            </Form>
        </div>
    )
}

