import React from 'react'
import { Checkbox } from '@material-ui/core'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const Item = (props) => {
    return (
        <div className='container grid border-2 rounded-lg space-y-2 my-1'>
            <div className='col-start-1'><Checkbox color='primary'/></div>
            <div className='col-start-2 col-span-8 lg:max-w-7xl lg:-ml-4 xl:-ml-7'>we are happy to do our homework and play</div>
            <div className='col-start-10 col-span-2 mx-auto lg:block relative lg:left-7 hidden'>
                <AcUnitIcon color='primary'/>
                <AcUnitIcon/>
                <AcUnitIcon/>
                <AcUnitIcon/>
                <AcUnitIcon/>
            </div>
            <div className='col-start-12 mx-auto'>
                <DeleteIcon className='h-full relative lg:left-4'/>
            </div>
            <div className='col-start-13 mx-auto'><MoreVertIcon/></div>
        </div>
    )
}

export default Item
