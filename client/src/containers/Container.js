import React, {useState, createContext, useEffect} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../components/Backdrop'
import axios from '../axios'

export const Context = createContext('DefaultValue')

export const Container = (props) => {
    const [infoFlag, setInfoFlag] = useState(false)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])

    const infoPageHandler = (value) =>{
        setInfoFlag(value)
    }

    useEffect(()=>{
        axios.get('/todoData.json')
            .then(res=>{
                const {data} = res
                if(data)
                    setTodoData(data)
            })
            .catch(err=>console.log(err))
    }, [])

    /**
     * context function
     */

    const infoIdHandler = (id) =>{
        setInfoId(id)
        todoData.forEach(e=>{
            if(e.id===id)
            setInfoSpace(e)
        })
        infoPageHandler(true)
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

    /**
     * Uploader function Context
     */

    const attributeChangeUploader = (name, value , id)=>{
        const data = {name, value, id}
        axios.post('/attributeChange.json', data)
            .then(res=>{
                console.log(res)
            })
            .catch(err=>console.log(err))
    }

    const itemDeleteUploader = (id)=>{
        const data = {id}
        axios.post('/itemDelete.json', data)
            .then(res=>{
                console.log(res)
            })
            .catch(err=>console.log(err))
    }

    const passingContext = {infoIdHandler, itemAddHandler, itemDeleteHandler, attributeChangeHandler,
        attributeChangeUploader, itemDeleteUploader}

    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            <Context.Provider value={passingContext}>
            { infoFlag?
            <div>
                <SubInfo infoSpace={infoSpace} infoPageHandler={infoPageHandler}/>
                <div onClick={()=>infoPageHandler(false)}>
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


