import './App.css'
import MHome from '#modules/home/pages'
import { getAll } from '#common/queries-fn/users.query'
import { useEffect } from 'react'
// import MHome from './modules/home/pages'

function App() {
    const { data: _data, isLoading: isDataLoading } = getAll()
    console.log('🚀 ~ _data', _data)

    return (
        <div className="h-10 w-10 bg-red-500">
            <MHome />
        </div>
    )
}

export default App
