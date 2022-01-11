import React from 'react'

import Checkbox from '../tools/Checkbox'
import DeleteIcon from '@material-ui/icons/Delete'

const SubItem = ({subTaskName='Sub Task', checked}) => {
    return (
        <div className='container grid grid-cols-12 border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10 w-4/5'>
            <div className='col-start-1'><Checkbox color='primary'/></div>
            <div className='col-start-4 sm:col-start-3 lg:col-start-3 xl:col-start-2  col-span-7 lg:max-w-7xl'>{subTaskName}</div>
            <div className='col-start-11 lg:col-start-12 mx-auto'>
                <DeleteIcon  className='h-full hover:cursor-pointer'/>
            </div>
        </div>
    )
}

export default SubItem
