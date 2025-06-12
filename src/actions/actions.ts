'use server';

import { auth, signIn, signOut } from '@/auth';
import prisma from '@/lib/db';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';





export async function createTask(title: string) {

  try {
    const session = await auth()
    if (!session) {
      return { success: false, message: "User not logged in" }
    }
    const email = session.user?.email as string
    const user = await prisma.user.findUnique({
      where:
        { email: email }
    })
    const userid = user?.id as string
    const newTask = await prisma.task.create({
      data: {
        title: title,
        userid: userid

      }
    })
    console.log("New Task is ", newTask);

    return { success: true, message: "Task created successfully", data: newTask }
  } catch (error) {
    console.log(error)
    return { success: false, message: "Failed to create task", data: null }
  }
}

export async function access(){
  const session= await auth()
  if (session){
    redirect('/')
  }
}
export async function loginuser(email: string, password: string) {
  try {

    const existinguser = await prisma.user.findUnique({
      where: { email: email }
    })
    if (!existinguser) {
      return { success: false, message: "invalid User" }
    } else {
      await signIn("credentials", { email: email, password, redirect: false })
      return { success: true, message: "User found" }
    }



  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" }
        default: return { success: false, message: "Something went wrong" }
      }
    }
    return { success: false, message: "something went wrong" }
  }
}

export async function signupuser(email: string, password: string) {
  try {
    const existinguser = await prisma.user.findUnique({
      where: { email: email }
    })
    if (existinguser) {
      return { success: false, message: "email already exists" }
    }
    await signIn("credentials", { email: email, password: password, redirect: false })
    return { success: true, message: "User created successfully " }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" }
        default: return { success: false, message: "Something went wrong" }
      }
    }
    return { success: false, message: "Something went wrong" }
  }

}
export async function logout() {
  await signOut()
}

export async function getTasks() {
  const session = await auth()
  const email = session?.user?.email as string
  const user = await prisma.user.findUnique({
    where:{email:email}
  })

 
  const completeTasks = await prisma.task.findMany({
    where: { isCompleted: true, userid:user?.id }
  })
  const inCompleteTasks = await prisma.task.findMany({
    where: { isCompleted: false, userid:user?.id}
  })
  console.log("complete tasks are", completeTasks);
  console.log("incomplete tasks are ", inCompleteTasks)
  return { completeTasks: completeTasks, inCompleteTasks: inCompleteTasks }
}

export async function updateTask(id: number, status: boolean) {
  try {
    const taskUpdate = await prisma.task.update({
      where: {
        id: id,

      },
      data: {
        isCompleted: status
      },
    });
    return taskUpdate;
  } catch (error) {
    console.error('Error upating Error:', error);
    throw error;
  }
}

export async function deleteTask(id: number) {
  try {
    const taskDelete = await prisma.task.delete({
      where: {
        id: id
      }
    });
    return taskDelete;
  } catch (error) {
    console.log(error);
    return null;
  }
}

