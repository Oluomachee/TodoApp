'use client'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Task } from '@prisma/client'
import { createTask, deleteTask, logout, updateTask } from '@/src/actions/actions'
import { useRouter } from 'next/navigation'
import { Checkbox } from './ui/checkbox'
import { MdDelete } from "react-icons/md";
import Image from 'next/image'


const TaskScreen = ({ completeList, inCompleteList }: { completeList: Task[], inCompleteList: Task[] }) => {
  const [task, settask] = useState('')
  const [tasklist, settasklist] = useState(inCompleteList)
  const router = useRouter()
  const handlesubmit = async () => {
    const response = await createTask(task)
    if (response.success) {
      settask('')
      const newlist = [...tasklist, response.data]
      settasklist(newlist as Task[])
      router.refresh()


    }
    console.log(response.message)
  }
  const handleupdate = async (id: number) => {
    const taskUpdate = await updateTask(id, true)
    router.refresh()
    const newList = inCompleteList.filter((task) => task.id !== taskUpdate.id)
    settasklist(newList)
  }
  const handledelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?")
    if (!confirmDelete) return;

    const taskDelete = await deleteTask(id);
    if (taskDelete) {
      router.refresh();
      const newList = tasklist.filter((task) => task.id !== taskDelete.id);
      settasklist(newList);
    }
  }
  return (

    <div className='flex flex-col justify-center items-center w-full gap-16'>
      <div className='bg-black w-full h-36 pt-8 justify-content-center items-center flex flex-col gap-8'>
        <Image className='w-24 ' src="/Logo.png" width={50} height={50} alt="logo image" />

        {/* <h1 className='text-blue-600 text-4xl font-bold bg-[#0D0D0D] '>TODO APP</h1> */}
        <div className='flex  w-xl p-1 gap-2 rounded-md items-center bg-grey'>

          <Input onChange={(e) => { settask(e.target.value) }} value={task} type='text' placeholder='Add Task' className='border-none text-white focus-visible:ring-0 bg-[#262626] h-12 ' />
          <Button onClick={() => { handlesubmit() }} className='max-w-md bg-[#1E6F9F] h-12 cursor-pointer'>Add</Button>
        </div>
      </div>
      <div className='gap-8 w-xl ' >
        <div>
          <div className='flex w-full justify-between pb-2'>
            <p className='text-[#8284FA]'>Total Tasks ({completeList.length + inCompleteList.length})</p>
            <p className='text-[#8284FA]'>Concluded Tasks ({completeList.length} of {completeList.length + inCompleteList.length})</p>
          </div>
          {/* <h1 className='text-xl font-bold'>Incomplete List</h1> */}
          {tasklist.length > 0 ? tasklist.map((task, index) => (
            <div className=' gap-4 bg-[#262626] rounded-lg shadow-md p-4 flex items-center justify-ben mb-4 hover:shadow-lg transition-shadow' key={index}>
              <Checkbox defaultChecked={task.isCompleted} onCheckedChange={() => handleupdate(task.id)} />
              <div className='flex justify-between w-full' >
                <div className='justify-between place-content-between text-white' >{task.title} </div>
                <MdDelete onClick={() => handledelete(task.id)} className='text-white text-xl' />
              </div>


            </div>
          )) : <div className='items-center flex flex-col'><Image className='w-24 ' src="/File.png" width={50} height={50} alt="logo image" />
            <p className='text-[#8284FA]'>You don&apos;t have any tasks yet.<br/>Create tasks and organize your to-do items.</p></div>}

        </div>
        <div>
          {/* <h1 className='text-xl font-bold'>Completed List</h1> */}
          {completeList.length > 0 ? completeList.map((task, index) => (
            <div className=' place-content-between bg-[#262626] rounded-lg shadow-md p-4 flex items-center justify-between mb-4 hover:shadow-lg transition-shadow' key={index}>
              <div className='text-white line-through'>{task.title}</div>
              <MdDelete onClick={() => handledelete(task.id)} className='text-white text-xl' />


            </div>
          )) : <div className='text-[#8284FA]'></div>}

        </div>

      </div>
      <div className='flex place-items-center w-full justify-center'>
        <Button className='text-[#8284FA]' onClick={async () => await logout()} >SignOut</Button>
      </div>

    </div>
  )
}

export default TaskScreen