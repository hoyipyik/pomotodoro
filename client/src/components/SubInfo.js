import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SubItem from './SubItem'
import Checkbox from '../tools/Checkbox'
import Switch from '../tools/Switch'
import Slider from '../tools/Slider'

const SubInfo = ({taskName='Learn React', checked, priority, pomoTimes=1, subTasks}) => {
    const tag = `Pomodoro Times  ${pomoTimes}`
    return (
        <div className='absolute z-50 bg-white mx-auto lg:w-8/12 w-5/6 h-5/6 my-8 rounded-xl shadow-md'>            
            <div className='container mx-5 my-4 p-4 w-auto'>
                <div className='flex'>
                    <input 
                        value={taskName}
                        className='basis-7/8 outline-none inline-block p-2 w-5/6 border-b-2 focus:border-blue-500 font-bold text-xl'/>
                    <DeleteIcon className='hover:cursor-pointer basis-1/8 mx-auto my-auto' />
                </div>
            
                <div className='grid grid-cols-3 container my-4'>
                    <div className='col-span-2'>
                        <div className='flex'>
                            <div className='basis-2/7 my-auto'>
                                <span>Check</span>
                                <Checkbox/>
                            </div>                            
                            <div className='basis3/7 my-auto mx-4'>
                                <span >Priority</span>
                                <Switch color='primary'/>
                            </div>
                        </div>
                        <div className='my-auto'>
                            <div className='w-2/6 py-2 inline-block'>{tag}</div>
                            <div className='w-3/6 relative top-2 inline-block -mx-2'> 
                                <Slider 
                                    // value={pomoTimes}
                                    // onChange
                                />
                            </div>
                            
                        </div>
                        <div>
                            <input 
                                placeholder='Input sub task here'
                                className='outline-none inline-block w-3/5 border-b-2'/>
                            <AddCircleIcon 
                                style={{fill:'#155fd8'}} 
                                color='primary' 
                                className='relative hover:cursor-pointer left-2'
                            />
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
