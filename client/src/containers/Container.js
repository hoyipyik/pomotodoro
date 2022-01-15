import React, {useState, useEffect} from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../tools/Backdrop'
import axios from '../axios'
import { Context } from '../tools/Context'
// import { ContextApp } from '../tools/Context'

const Container = ({pomoMode, clockMode, onlineMode,
        todoFlag, refresh, modeChangeHandler}) => {
    const [infoFlag, setInfoFlag] = useState(false)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])
    const [scheduleData, setScheduleData] = useState([])

    // flag handler

    const infoPageHandler = (value) =>{
        setInfoFlag(value)
    }

    /**
     * Data fetching and setting function
     */

    const setDataFunction = (flag, data, type) =>{
        if(flag){
            setTodoData(data)
            console.log(`${type} todoData load`, data)
        }else {
            setScheduleData(data)
            console.log(`${type} scheduleData load`, data)
        }
    }

    const onlineDataFetchingHandler = (flag) =>{
        let api = flag ? '/todoData.json' : '/scheduleData.json'
        console.log('fetching online')
        axios.get(api)
            .then(res=>{
                const {data} = res
                const onlineData = data
                if(onlineData)
                    setDataFunction(flag, onlineData, 'online')
            })
            .catch(err=>{
                console.log(err)
                window.alert('You are offline now, turn to local ')
                modeChangeHandler(false, "onlineMode")
            })
    }

    const localDataFetchingHandler = (flag) =>{
        console.log('fetching local')
        const tagString = flag ? 'localTodoData' : 'localScheduleData'
        const localData = JSON.parse(localStorage.getItem(tagString))
        // console.log('localdata .......', localData)
            if(localData){
                setDataFunction(flag, localData, 'local')
            }else{
                setDataFunction(flag, [], 'local')
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
        return
    }, [refresh, onlineMode])

    // set data to localStorage

    useEffect(()=>{
        if(!onlineMode){
            const flag = todoFlag
            const tag = flag ? 'localTodoData' : 'localScheduleData'
            const data = flag ? todoData : scheduleData
            if(data){
                console.log('set to localStorage', data)
                localStorage.setItem(tag, JSON.stringify(data))
            }
        }
        return
    }, [todoData, scheduleData, onlineMode])

    /**
     * context function
     */

    const infoIdHandler = (id, type) =>{
        setInfoId(id)
        const data = type ? todoData : scheduleData
        data.forEach(e=>{
            if(e.id===id)
            setInfoSpace(e)
        })
        infoPageHandler(true)
    }

    const itemDeleteHandler = (id, type) =>{
        const oldData = type ? todoData : scheduleData
        const newData = oldData.filter((e)=>e.id!==id)
        if(type)
            setTodoData(newData)
        else
            setScheduleData(newData)
    }

    const itemAddHandler = (item, type) =>{
        const oldData = type ? todoData : scheduleData
        const newData = [...oldData, item]
        if(type)
            setTodoData(newData)
        else
            setScheduleData(newData)
    }

    const attributeChangeHandler = (name, value, id, type) =>{
        const oldData = type ? todoData : scheduleData
        const newData = oldData.map((e, index)=>{
            if(e.id === id){
                e[name] = value
            }
            return e
        })
        if(type)
            setTodoData(newData)
        else
            setScheduleData(newData)
    }

    /**
     * sundden offline handler
     */

    const suddenOfflineHandler = (type) =>{
        const onlineTodo = todoData
        const tag = type === 'todo' ? 'localTodoData' : 'localScheduleData'
        const localTodo = JSON.parse(localStorage.getItem(tag))
        const newData = [...localTodo, ...onlineTodo]
        localStorage.setItem(tag, JSON.stringify(newData))
    }

    /**
     * Uploader function Context
     */

    const attributeChangeUploader = (name, value , id, type)=>{
        if(onlineMode){
            const data = {name, value, id, type}
            axios.post('/attributeChange.json', data)
                .then(res=>{
                    console.log('update')
                })
                .catch(err=>{
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    suddenOfflineHandler('todo')
                })
        } else{
            console.log('local update')
        }
    }

    const itemDeleteUploader = (id, type)=>{
        if(onlineMode){
            const data = {id, type}
            axios.post('/itemDelete.json', data)
                .then(res=>{
                    console.log('delete')
                })
                .catch(err=>{
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    suddenOfflineHandler('todo')
                })
        }else{
            console.log('local delete')
        }
    }

    const passingContext = {infoIdHandler, itemAddHandler, itemDeleteHandler, pomoMode, modeChangeHandler,
        clockMode, attributeChangeHandler, attributeChangeUploader, itemDeleteUploader}
    
    // console.log(onlineMode, 'render container')
    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            <Context.Provider value={passingContext}>
            { infoFlag?
            <div>
                <SubInfo infoSpace={infoSpace} infoPageHandler={infoPageHandler}/>
                <div onClick={()=>infoPageHandler(false)}>
                    <Backdrop />
                </div>
            </div>:null}
            <div className='-z-20'>
                <Add onlineMode={onlineMode} suddenOfflineHandler={suddenOfflineHandler}/>
                { todoFlag ? <Holder data={todoData}/>
                : <Holder data={scheduleData}/> }
            </div>
            </Context.Provider>
        </div>
    )
}

export default React.memo(Container)
