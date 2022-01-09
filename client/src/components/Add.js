import React from 'react'

const Add = (props) => {
    return (
        <div className='add'>
            <header>
                <h1 className='text-2xl font-bold font-sans'>What's Your Plan Today</h1>
                <input className='lg:w-5/6  px-1 py-1 h-11 my-4  w-full border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'>
                </input>
                <button className='text-lg bg-blue-600 text-white px-2 w-20 h-10 rounded-md border-0 hover:bg-blue-500 outline-none'>Add</button>
            </header>
        </div>
    )
}

export default Add
