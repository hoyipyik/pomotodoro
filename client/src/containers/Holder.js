import React from 'react'

import Item from '../components/Item'

const Holder = () => {
    return (
        <div className='container my-4 lg:w-11/12 w-full'>
           <Item/>
           <Item/>
           <Item/>
        </div>
    )
}

export default Holder
