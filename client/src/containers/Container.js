import React, {useState} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'

const Container = (props) => {
    const [subFlag, setSubFlag] = useState(false)

    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            { subFlag?
                <SubInfo/>:
            <tag>
                <Add />
                <Holder />
            </tag>}
        </div>
    )
}

export default Container
