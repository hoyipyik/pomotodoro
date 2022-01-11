import React, {useState, useContext, useEffect, createRef} from 'react'
import { Context } from '../containers/Container'

const Add = (props) => {
    const [taskName, setTaskName] = useState('')

    const {itemAddHandler} = useContext(Context)
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

    const buttonFunction = () =>{
        addItemFunction(taskName)
    }

    const addItemFunction = (name) =>{
        const taskName = name
        const seed = new Date()
        let id = seed.getTime()
        const item = {
            id: id,
            taskName: taskName,
            checked: false,
            priority: false,
            pomoTimes: 0,
            subTasks: [],
        }
        if (taskName!==''){
            itemAddHandler(item)
            itemAddUploader(item)
        }
        setTaskName('')
    }

    /**
     * Uploader Function
     */

    const itemAddUploader = (item) =>{
        
    }

    return (
        <div className='select-none'>
            <header>
                <h1 className='text-2xl font-bold font-sans'>What's Your Plan Today</h1>
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

export default React.memo(Add)
