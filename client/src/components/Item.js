import React, {useContext} from 'react'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Checkbox from '../tools/Checkbox'
import { Context } from '../containers/Container'
  
const Item = ({id, taskName, checked, priority, pomoTimes}) => {
    const blue = {fill:'#155fd8'}
    const gray = {fill:'#7b8088'}
    const seed = [1,1,1,1,1]

    const {infoIdHandler, itemDeleteHandler, taskNameHandler, 
        priorityHandler, checkedHandler, pomoTimesHandler} = useContext(Context)

    const pomoIcon = seed.map((e, index)=>{
        const element = <AcUnitIcon key={id+index} style={gray} />
        if(pomoTimes === 0)
            return element
        else if(index < pomoTimes)
            return <AcUnitIcon key={id+index-0.0001} style={blue} />
        else 
            return element
    })

    const checkedFunction = () =>{

    }

    const deleteFunction = () =>{

    }

    const priorityFunction = () =>{

    }

    const pomoTimesFunction = () =>{

    }

    const infoDirectFunction = () =>{

    }

    return (
        <div className='container grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10'>
            <div className='col-start-1 col-span-2 sm:col-span-1'>
                <Checkbox checked={checked} />
            </div>
            <div 
                className='col-start-3 col-span-9 sm:col-start-2 sm:col-span-10 xl:col-span-8 lg:col-span-7 lg:max-w-7xl lg:-ml-4 xl:-ml-7' 
                style={{textDecoration: checked ? "line-through" : null,
                fontWeight: priority ? "bold" : null}}>
                    {taskName}
            </div>
            <div className='hover:cursor-pointer lg:col-start-9 lg:col-span-3 xl:col-start-10 xl:col-span-2 mx-auto lg:block relative lg:left-7 hidden'>
                {pomoIcon}
            </div>
            <div className='col-start-12 mx-auto'>
                <DeleteIcon className='hover:cursor-pointer h-full relative lg:left-4'/>
            </div>
            <div className='col-start-13 hover:cursor-pointer mx-auto'>
                <MoreVertIcon/>
            </div>
        </div>
    )
}

export default Item