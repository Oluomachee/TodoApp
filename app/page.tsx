import { auth } from '@/auth'
import TaskScreen from '@/components/TaskScreen'
import { getTasks } from '@/src/actions/actions'
import { redirect } from 'next/navigation'
import React from 'react'



const page = async () => {
  const session = await auth()
  if (!session){
    redirect('/login')
  }
  const {completeTasks, inCompleteTasks} = await getTasks()  
  return (
    <div>
      {/* <p className='text-white'>{JSON.stringify(session)} </p> */}

      <TaskScreen completeList={completeTasks} inCompleteList={inCompleteTasks}/> 
    </div>
  )
}

export default page