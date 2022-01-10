import React, {useState, createContext} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../components/Backdrop'

export const Context = createContext('DefaultValue')

export const Container = (props) => {
    const [infoFlag, setInfoFlag] = useState(true)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])

    const flagHandler = (func, value) =>{
        func(value)
    }
    /**
     * context function
     */

    const infoIdHandler = () =>{

    }

    const itemDeleteHandler = () =>{

    }

    const itemAddHandler = (item) =>{
        const oldData = todoData
        const newData = [...oldData, item]
        setTodoData(newData)
        // console.log(todoData)
    }

    const taskNameHandler = () =>{

    }

    const priorityHandler = () =>{

    }

    const checkedHandler = () =>{

    }

    const pomoTimesHandler = () =>{

    }

    const subTasksHandler = () =>{

    }

    const passingContext = {infoIdHandler, itemAddHandler, itemDeleteHandler, 
        taskNameHandler, priorityHandler, checkedHandler, pomoTimesHandler, subTasksHandler}

    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            <Context.Provider value={passingContext}>
            { infoFlag?
            <div>
                <SubInfo/>
                <div onClick={()=>flagHandler(setInfoFlag, false)}>
                    <Backdrop/>
                </div>
            </div>:null}
            <div className='-z-20'>
                <Add />
                <Holder todoData={todoData}/>
            </div>
            </Context.Provider>
        </div>
    )
}


