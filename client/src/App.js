import React, {useState, useEffect} from 'react'

import Sidebar from './components/Sidebar'
import {Container} from './containers/Container'

const App = () =>{
  // const [scheduleFlag, setScheduleFlag] = useState(false)

  return (
    <div className='flex flex-row min-h-fit'>
      <div className='select-none bg-gray-100 lg:block hidden md:basis-1/5 h-screen overflow-auto'>
        <Sidebar/>
      </div>
      <div className='lg:basis-4/5 basis-full overflow-auto h-screen'>
        <Container/>
      </div>
    </div>
  )
}

export default App;
