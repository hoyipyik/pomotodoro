import React from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import userIcon from '../images/user.png'

const Sidebar = () => {
    return (
        <div className='h-full box-border relative'>
            <div className='text-2xl text-center pt-5 py-2 p-2 mx-1 font-bold'>
                𝓟𝓸𝓶𝓸𝓽𝓸𝓭𝓸𝓻𝓸
            </div>
            <div className='flex flex-col relative h-1/4 m-12 w-auto border-2'>
                <AccountCircleIcon className='block mt-1 aspect-auto h-2/3 w-2/3 mx-auto justify-items-center rounded-lg' style={{zoom:3}}/>
                <p className='p-4 mx-auto justify-items-center'>Username</p>
            </div>
            <div className='container flex flex-col relative top-6 m-5 w-auto h-2/7'>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>To do</div>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>Schedule</div>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>Setting</div>
            </div>

            <div className='absolute bottom-1 mx-auto text-xs font-mono w-full text-center'>
                Copyright 2022 Ho Yel-i
            </div>
        </div>
    )
}

export default Sidebar
