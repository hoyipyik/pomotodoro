import React, {useState, createContext, useEffect} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../tools/Backdrop'
import axios from '../axios'

export const Context = createContext('DefaultValue')

export const Container = ({pomoMode, clockMode, onlineMode, todoFlag, refresh}) => {
    const [infoFlag, setInfoFlag] = useState(false)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])
    const [scheduleData, setScheduleData] = useState([])

    const infoPageHandler = (value) =>{
        setInfoFlag(value)
    }

    /**
     * Data fetching and setting function
     */

    const setDataFunction = (flag, data, type) =>{
        if(flag){
            setTodoData(data)
            console.log(data, `${type} todoData load`)
        }else {
            setScheduleData(data)
            console.log(data, `${type} scheduleData load`)
        }
    }

    const onlineDataFetchingHandler = (flag) =>{
        let api = flag ? '/todoData.json' : '/scheduleData.json'
        axios.get(api)
            .then(res=>{
                const {data} = res
                const onlineData = data
                if(onlineData)
                    setDataFunction(flag, onlineData, 'online')
            })
            .catch(err=>console.log(err))
    }

    const localDataFetchingHandler = (flag) =>{
        const tagString = flag ? 'localTodoData' : 'localScheduleData'
        const localData = JSON.parse(localStorage.getItem(tagString))
            if(localData){
                setDataFunction(flag, localData, 'local')
            }
    }

    // fetching data to state

    useEffect(()=>{
        const flag = todoFlag
        if(onlineMode){
            onlineDataFetchingHandler(flag)
        }else{
            localDataFetchingHandler(flag)
        }
    }, [refresh, onlineMode])

    // set data to localStorage

    useEffect(()=>{
        if(!onlineMode){
            const flag = todoFlag
            const tag = flag ? 'localTodoData' : 'localScheduleData'
            const data = flag ? todoData : scheduleData
            localStorage.setItem(tag, JSON.stringify(data))
        }
    }, [todoData, scheduleData, onlineMode])

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
        if(onlineMode){
            const data = {name, value, id}
            axios.post('/attributeChange.json', data)
                .then(res=>{
                    console.log(res, 'update')
                })
                .catch(err=>console.log(err))
        } else{
            console.log('local update')
        }
    }

    const itemDeleteUploader = (id)=>{
        if(onlineMode){
            const data = {id}
            axios.post('/itemDelete.json', data)
                .then(res=>{
                    console.log(res, 'delete')
                })
                .catch(err=>console.log(err))
        }else{
            console.log('local delete')
        }
    }

    const passingContext = {infoIdHandler, itemAddHandler, itemDeleteHandler, pomoMode, 
        clockMode, attributeChangeHandler, attributeChangeUploader, itemDeleteUploader}

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
                <Add onlineMode={onlineMode}/>
                <Holder todoData={todoData}/>
            </div>
            </Context.Provider>
        </div>
    )
}


