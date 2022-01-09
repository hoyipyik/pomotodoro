import React from 'react'
import { Checkbox } from '@material-ui/core'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const Item = ({taskName, priority, pomoTimes, subTasks}) => {
    return (
        <div className='container grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10'>
            <div className='col-start-1'><Checkbox color='primary'/></div>
            <div className='col-start-2 col-span-8 lg:max-w-7xl lg:-ml-4 xl:-ml-7'>{taskName}</div>
            <div className='hover:cursor-pointer col-start-10 col-span-2 mx-auto lg:block relative lg:left-7 hidden'>
                <AcUnitIcon color='primary'/>
                <AcUnitIcon/>
                <AcUnitIcon/>
                <AcUnitIcon/>
                <AcUnitIcon/>
            </div>
            <div className='col-start-12 mx-auto'>
                <DeleteIcon className='hover:cursor-pointer h-full relative lg:left-4'/>
            </div>
            <div className='col-start-13 hover:cursor-pointer mx-auto'><MoreVertIcon/></div>
        </div>
    )
}

export default Item
