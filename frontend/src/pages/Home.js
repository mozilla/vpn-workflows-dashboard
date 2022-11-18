import React, { useEffect, useState } from 'react'
// import { Doughnut } from 'react-chartjs-2';
// import { PieChart } from 'recharts';
// import { getFullTestWorkflowReport } from '../api/functional_tests'
// import ChartPie from '../components/PieChart'
// import wfData from '../data/data.json'
  

const HomePage = () => {
    // const [isLoading, setLoading] = useState(false)
    // const [workflowData, setWorkflowData] = useState({})
    // const [chartData, setChartData] = useState()

    useEffect(() => {
        // setLoading(true)        
        // getData()
        // setLoading(false)
    }, [])    

    return (
        <div>
            <div id="main-home">
                <div id="left">
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                    <div>List of Tests and run times</div>
                </div>
                <div id="right">right</div>
            </div>
        </div>
    )
}

export default HomePage;