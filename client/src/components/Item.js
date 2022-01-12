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

    const {infoIdHandler, itemDeleteHandler, attributeChangeHandler, pomoMode, 
        attributeChangeUploader, itemDeleteUploader} = useContext(Context)

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
        attributeChangeHandler(name, value, id)
        attributeChangeUploader(name, value, id)
    }

    const deleteFunction = () =>{
        itemDeleteHandler(id)
        itemDeleteUploader(id)
    }

    const infoDirectFunction = () =>{
        infoIdHandler(id)
    }

    return (
        <div className='container grid-cols-12 grid border-2 rounded-lg space-y-2 shadow-sm my-2 -z-10'>
            <div className='col-start-1 col-span-2 sm:col-span-1'>
                <Checkbox 
                    checked={checked} 
                    onChange={()=>attributeChangeFunction('checked', !checked)}
                />
            </div>
            <div 
                onClick={()=>attributeChangeFunction('priority', !priority)}
                className=' pt-px col-start-3 col-span-9 sm:col-start-2 sm:col-span-10 xl:col-span-8 lg:col-span-7 lg:max-w-7xl lg:-ml-4 xl:-ml-7' 
                style={{textDecoration: checked ? "line-through" : null,
                fontWeight: priority ? "bold" : null}}>
                   {taskName} 
            </div>
            { pomoMode ?
            <div className='lg:col-start-9 lg:col-span-3 xl:col-start-10 xl:col-span-2 mx-auto lg:block relative lg:left-7 hidden'>
                {pomoIcon}
            </div> : null }
            <div className='col-start-12 mx-auto'>
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

export default Item