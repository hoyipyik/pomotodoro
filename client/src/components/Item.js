import React, {useContext} from 'react'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Checkbox from '../tools/Checkbox'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { Context } from '../tools/Context'
import { ContextApp } from '../tools/Context'
  
const Item = ({id, taskName, checked, priority, pomoTimes, chain, push}) => {
    const blue = {fill:'#155fd8'}
    const gray = {fill:'#7b8088'}
    const seed = [1,1,1,1,1]

    const {infoIdHandler, itemDeleteHandler, attributeChangeHandler, pomoMode,
        attributeChangeUploader, itemDeleteUploader} = useContext(Context)

    const {todoFlag} = useContext(ContextApp)

    const pomoIcon = seed.map((e, index)=>{
        const element = <AcUnitIcon key={id+index} style={gray} className='hover:cursor-pointer'
            onClick={()=>attributeChangeFunction('pomoTimes', index+1)}/>
        if(pomoTimes === 0)
            return element
        else if(index < pomoTimes)
            return <AcUnitIcon key={id+index-0.0001} style={blue} className='hover:cursor-pointer'
                onClick={()=>attributeChangeFunction('pomoTimes', index+1)}/>
        else 
            return element
    })

    const attributeChangeFunction = (name, value) =>{
        const type = todoFlag
        attributeChangeHandler(name, value, id)
        attributeChangeUploader(name, value, id, type, chain)
    }

    const deleteFunction = () =>{
        const type = todoFlag
        itemDeleteHandler(id)
        itemDeleteUploader(id, type, chain)
    }

    const pushFuntion = (value) =>{
        attributeChangeFunction('push', value)
        // pushHandler(id, value)
    }

    const infoDirectFunction = () =>{
        const type = todoFlag
        infoIdHandler(id, type)
    }

    const contentClassName = push ?  (todoFlag ? 'container grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10' : 'container border-l-4 border-l-gray-400 grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10') 
        : 'container grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10'
    const add2todoFlagString = push ? 'Task Added' : 'Add Today' 

    return (
        <div className={contentClassName}>
            <div className='col-start-1 col-span-2 sm:col-span-1'>
                <Checkbox 
                    checked={checked} 
                    onChange={()=>attributeChangeFunction('checked', !checked)}
                />
            </div>
            <div 
                onClick={()=>attributeChangeFunction('priority', !priority)}
                className=' pt-px col-start-3 col-span-8 sm:col-start-2 sm:col-span-10 xl:col-span-8 lg:col-span-7 lg:max-w-7xl lg:-ml-4 xl:-ml-7' 
                style={{textDecoration: checked ? "line-through" : null,
                fontWeight: priority ? "bold" : null}}>
                   {taskName} 
            </div>
            
            <div className='lg:col-start-9 lg:col-span-3 xl:col-start-10 xl:col-span-2 mx-auto lg:block relative lg:left-7 hidden'>
            { todoFlag ? 
                <div>{pomoMode ? <div>{pomoIcon}</div>: null }</div> : 
                <div 
                    onClick={()=>pushFuntion(!push)}
                    className='flex my-auto hover:cursor-pointer border-2 px-2 rounded-xl border-gray-100'>
                    <AddBoxIcon style={push ? blue : null}/>
                    <span  className=' text-sm p-px my-auto ml-3'>
                        {add2todoFlagString}
                    </span>
                </div>}
            </div> 
            <div className='col-start-11 sm:col-start-12 mx-auto'>
                <DeleteIcon 
                    onClick={deleteFunction}
                    className='hover:cursor-pointer h-full relative lg:left-4'
                />
            </div>
            <div className='col-start-13 hover:cursor-pointer mx-auto'>
                <MoreVertIcon onClick={infoDirectFunction}/>
            </div>
        </div>
    )
}

export default React.memo(Item)