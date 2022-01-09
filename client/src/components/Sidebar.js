import React from 'react'

import userIcon from '../images/user.png'

const Sidebar = () => {
    return (
        <div className='h-full relative box-border'>
            <div className='text-2xl text-center py-3 p-2 mx-1 font-bold'>
                𝓟𝓸𝓶𝓸𝓽𝓸𝓭𝓸𝓻𝓸
            </div>
            <div className='flex flex-col relative h-1/4 m-12 w-auto border-2'>
                <img className='block mt-1 aspect-auto h-2/3 w-2/3 mx-auto rounded-lg' src={userIcon}/>
                <p className='p-3 mx-auto mb-3 text-center'>Username</p>
            </div>
            <div className='container flex flex-col relative top-6 m-5 w-auto h-2/7'>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>To do</div>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>Schedule</div>
                <div className='bg-gray-300 hover:bg-slate-300 hover:cursor-pointer rounded-md px-2 py-1 text-center my-3'>Setting</div>
            </div>

            <div className='relative top-24 text-xs font-mono w-auto text-center'>
                Copyright 2022 Ho Yel-i
            </div>
        </div>
    )
}

export default Sidebar
