import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SubItem from './SubItem'

const SubInfo = () => {
    return (
        <div className='absolute z-50 bg-white mx-auto lg:w-8/12 w-5/6 h-5/6 my-8 rounded-xl shadow-md'>            
            <div className='container mx-5 my-4 p-4 w-auto'>
                <div className='flex'>
                    <input 
                        value='We will do my home work' 
                        className='basis-7/8 outline-none inline-block p-2 w-5/6 border-b-2 focus:border-blue-500 font-bold text-xl'/>
                    <DeleteIcon className='hover:cursor-pointer basis-1/8 mx-auto my-auto' />
                </div>
            
                <div className='grid grid-cols-3 container my-4'>
                    <div className='col-span-2'>
                        Details
                        <div>
                            Poriority
                        </div>
                        <div>
                            Pomodoro Times
                        </div>
                        <div>
                            <input 
                                placeholder='Input sub task here'
                                className='outline-none inline-block w-3/5 border-b-2'/>
                            <AddCircleIcon color='primary' className='relative hover:cursor-pointer left-2'/>
                        </div>

                        <div>
                            <SubItem/>
                            <SubItem/>
                            <SubItem/>
                            <SubItem/>
                            <SubItem/>
                        </div>
                    </div>
                    <div>
                        Pomodoro
                    </div>

                </div>
            </div>
            
        </div>
    )
}

export default SubInfo
