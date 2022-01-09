import React from 'react'

import Add from '../components/Add'
import Holder from './Holder'

const Container = (props) => {
    return (
        <div className='container w-full mx-auto px-10 my-3 py-2'>
            <Add />
            <Holder />
        </div>
    )
}

export default Container
