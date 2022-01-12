import React, {useState, useEffect} from 'react'

import Sidebar from './components/Sidebar'
import {Container} from './containers/Container'
import Setting from './components/Setting'
import Backdrop from './tools/Backdrop'

const App = () =>{
  const [todoFlag, setTodoFlag] = useState(true)
  const [onlineMode, setOnlineMode] = useState(true)
  const [pomoMode, setPomoMode] = useState(true)
  const [clockMode, setClockMode] = useState(false)
  const [settingPageFlag, setSettingPageFlag] = useState(false)
  const [refresh, setRefresh] = useState(false) 

  /**
   * mode flag set and load to/from localStorage
   */

  useEffect(()=>{
    const modeFlag  = JSON.parse(localStorage.getItem('modeFlag'))
    if(modeFlag){
      const {online, pomo, clock} = modeFlag
      setOnlineMode(online)
      setPomoMode(pomo)
      setClockMode(clock)
    }
  }, [])

  useEffect(()=>{
    const online = onlineMode
    const pomo = pomoMode
    const clock = clockMode
    const modeFlag = { online, pomo, clock}
    localStorage.setItem('modeFlag', JSON.stringify(modeFlag))
  }, [onlineMode, pomoMode, clockMode])
  
  //

  const settingPageHandler = (value) =>{
    setSettingPageFlag(value)
  }

  const refreshHandler = () =>{
    setRefresh(!refresh)
  }

  /**
   * setting mode function
   */

  const modeChangeHandler = (value, name) =>{
    switch (name) {
      case 'onlineMode':
        setOnlineMode(value)
        break;
      case 'pomoMode':
        setPomoMode(value)
        break;
      case 'clockMode':
        setClockMode(value) 
      default:
        break;
    }
  }

  return (
    <div>
      { settingPageFlag ?
      <div>
        <Setting 
          modeChangeHandler={modeChangeHandler}
          pomoMode={pomoMode} clockMode={clockMode}
          onlineMode={onlineMode} 
        />
        <div onClick={()=>settingPageHandler(false)}><Backdrop /></div>
      </div> : null }
      <div className='flex flex-row min-h-fit'>
        <div className='select-none bg-gray-100 lg:block hidden md:basis-1/5 h-screen overflow-auto'>
          <Sidebar 
            settingPageHandler={settingPageHandler} 
            refreshHandler={refreshHandler}/>
        </div>
        <div className='lg:basis-4/5 basis-full overflow-auto h-screen'>
          <Container
            pomoMode={pomoMode} clockMode={clockMode}
            onlineMode={onlineMode} todoFlag={todoFlag} refresh={refresh}/>
        </div>
      </div> 
    </div>
  )
}

export default App;
