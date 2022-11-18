import React, { useEffect, useState } from 'react'
import { getFullTestWorkflowReport } from '../api/functional_tests'

export interface IHomePageProps {}

const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
    const [isLoading, setLoading] = useState(false)
    const [workflowData, setWorkflowData] = useState({})

    useEffect(() => {
        setLoading(true)        
        // getData()
        setLoading(false)
    }, [])

    const getData = async () => {        
        const data = await getFullTestWorkflowReport()
        setWorkflowData(data)
        console.log(data);
        
    }

    return (
        <div>
            {
                isLoading ? <div>Loadikng...</div> : 
                <p>done</p>
            }
        </div>
    )
}

export default HomePage;