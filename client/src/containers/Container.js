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

    const infoIdHandler = (id) =>{
        setInfoId(id)
        todoData.forEach(e=>{
            if(e.id===id)
            setInfoSpace(e)
        })
    }

    const itemDeleteHandler = (id) =>{
        const oldData = todoData
        const newData = oldData.filter((e)=>e.id!==id)
        setTodoData(newData)
    }

    const itemAddHandler = (item) =>{
        const oldData = todoData
        const newData = [...oldData, item]
        setTodoData(newData)
        // console.log(todoData)
    }

    const attributeChangeHandler = (name, value, id) =>{
        const oldData = todoData
        const newData = oldData.map((e, index)=>{
            if(e.id === id){
                e[name] = value
            }
            return e
        })
        setTodoData(newData)
    }

    // const taskNameHandler = () =>{

    // }

    // const priorityHandler = () =>{

    // }

    // const checkedHandler = () =>{

    // }

    // const pomoTimesHandler = () =>{

    // }

    // const subTasksHandler = () =>{

    // }

    const passingContext = {infoIdHandler, itemAddHandler, itemDeleteHandler, attributeChangeHandler}
        // taskNameHandler, priorityHandler, checkedHandler, pomoTimesHandler, subTasksHandler}

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


