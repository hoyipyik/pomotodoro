import React, {useState} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../components/Backdrop'

const Container = (props) => {
    const [subFlag, setSubFlag] = useState(true)

    const subInfoDestructor = () =>{
        setSubFlag(false)
    }

    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            { subFlag?
            <div>
                <SubInfo/>
                <div onClick={subInfoDestructor}>
                    <Backdrop/>
                </div>
            </div>:null}
            <div className='-z-20'>
                <Add />
                <Holder />
            </div>
        </div>
    )
}

export default Container
