import React from 'react'

import Item from '../components/Item'

const Holder = () => {
    return (
        <div className='container my-4 lg:w-11/12 w-full'>
           <Item taskName={'Carve a chip'}/>
           <Item taskName={'Sleep'}/>
           <Item taskName={'Watch Anime'}/>
           <Item taskName={'Play White Album 2'}/>
           <Item taskName={'Run'}/>
           <Item taskName={'Burning roommate\'s computer'}/>
           <Item taskName={'Learning Magic'}/>
           <br/>
        </div>
    )
}

export default Holder
