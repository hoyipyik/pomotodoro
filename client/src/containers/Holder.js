import React from 'react'

import Item from '../components/Item'

const Holder = ({data}) => {
    
    const itemList = data.map((e, index)=>{
        return <Item key={e.id+index+0.00001} id={e.id} taskName={e.taskName} 
            priority={e.priority} checked={e.checked} pomoTimes={e.pomoTimes} 
            chain={e.chain} push={e.push}/>
    })

    return (
        <div className='container my-4 lg:w-11/12 w-full'>
            {itemList}
           <br/>
        </div>
    )
}

export default React.memo(Holder)
