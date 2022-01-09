import React, {useState, useEffect} from 'react'

import Sidebar from './components/Sidebar'
import Container from './containers/Container'

const App = () =>{
  const [scheduleFlag, setScheduleFlag] = useState(false)

  return (
    <div className='flex flex-row h-min'>
      <div className='bg-gray-100 md:block hidden md:basis-1/5 h-screen overflow-auto '><Sidebar/></div>
      <div className='md:basis-4/5 basis-full overflow-auto'><Container/></div>
    </div>
  )
}

export default App;
