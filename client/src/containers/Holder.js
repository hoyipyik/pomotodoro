import React from 'react'

import Item from '../components/Item'

const Holder = ({todoData}) => {

    const itemList = todoData.map((e, index)=>{
        return <Item key={e.id+index-0.001} id={e.id} taskName={e.taskName} priority={e.priority}
            checked={e.checked} pomoTimes={e.pomoTimes} />
    })

    return (
        <div className='container my-4 lg:w-11/12 w-full'>
            {itemList}
            {/* <Item taskName={'Carve a chip'} priority={true} pomoTimes={2}/>
            <Item taskName={'Sleep'} checked={true}/>
            <Item taskName={'Watch Anime'}/>
            <Item taskName={'Play White Album 2'}/>
            <Item taskName={'Run'}/>
            <Item taskName={'Burning roommate\'s computer'}/>
            <Item taskName={'Learning Magic'}/> */}
           <br/>
        </div>
    )
}

export default Holder
