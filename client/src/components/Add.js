import React, {useState, useContext, useEffect, createRef} from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import { Context } from '../tools/Context'
import { ContextApp } from '../tools/Context'
import axios from '../axios'

const Add = ({onlineMode, suddenOfflineHandler}) => {
    const [taskName, setTaskName] = useState('')

    const {itemAddHandler, modeChangeHandler} = useContext(Context)
    const {minSidebarHandler, todoFlag} = useContext(ContextApp)
    const ref = createRef()

    useEffect(()=>{
        const listener = (event) =>{
            const {activeElement} = document
            // const targetElement = document.getElementById('addInput')
            const targetElement = ref.current
            // console.log(ref.current)
            if(activeElement === targetElement)
                if(event.code === 'Enter' || event.code === 'NumpadEnter'){
                    buttonFunction()
                    // console.log('enter')
                    event.preventDefault()
                }     
        }

        document.addEventListener('keydown', listener)
        return ()=>{
            document.removeEventListener('keydown', listener)
        }
    }, )

    const inputFunction = (e) =>{
        const {value} = e.target
        setTaskName(value)
    }

    const addItemFunction = (name, type) =>{
        const taskName = name
        const seed = new Date()
        let id = seed.getTime()
        const item = {
            id: id,
            taskName: taskName,
            checked: false,
            priority: false,
            pomoTimes: 0,
            todo: type,
            push: false,
            subTasks: [],
        }
        if (taskName!==''){
            itemAddHandler(item, type)
            itemAddUploader(item, type)
        }
        setTaskName('')
    }

    const buttonFunction = () =>{
        const type = todoFlag
        // console.log('button function', type)
        addItemFunction(taskName, type)
    }

    /**
     * Uploader Function
     */

    const itemAddUploader = (item, type) =>{
        if(onlineMode){
            const pack = {item, type}
            const tag = type ? 'todo' : 'schedule'
            axios.post('/itemAdd.json', pack)
            .then(res=>{
                console.log('add')
            })
            .catch(err=>{
                console.log(err)
                window.alert('You are offline now, turn to local ')
                modeChangeHandler(false, "onlineMode")
                suddenOfflineHandler(tag)
            })
        }else{
            console.log('local add')
        }
    }

    const title = todoFlag ? "What's Your Plan Today" : "This is Your Schedule Book"

    return (
        <div className='select-none'>
            <header>
                <div className='flex'>
                    <div 
                        onClick={minSidebarHandler} 
                        className='lg:hidden h-full my-auto mr-2  hover:cursor-pointer'><MenuIcon /></div>
                    <h1 className='inline md:text-2xl text-xl font-bold font-sans'>{title}</h1>
                </div>
                <input
                    id='addInput'
                    ref={ref} 
                    value={taskName}
                    onChange={inputFunction} 
                    className='lg:w-5/6  px-2 py-1 h-11 my-4  w-full border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'>
                </input>
                <button
                    onClick={buttonFunction}
                    className='text-lg bg-blue-600 text-white px-2 w-20 h-10 rounded-md border-0 hover:bg-blue-500 outline-none'
                    >
                    Add
                </button>
            </header>
        </div>
    )
}

export default Add
