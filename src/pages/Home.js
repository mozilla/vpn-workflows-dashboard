import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { LineChart, Line, PieChart, Pie, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getFullTestWorkflowReport } from '../api/functional_tests'
// import { Doughnut } from 'react-chartjs-2';
// import { PieChart } from 'recharts';
// import { getFullTestWorkflowReport } from '../api/functional_tests'
// import ChartPie from '../components/PieChart'
// import wfData from '../data/data.json'
const data = [{name: 'Page A', uv: 500, pv: 2800, amt: 3400}, {name: 'Page B', uv: 100, pv: 700, amt: 3000}, {name: 'Page C', uv: 200, pv: 800, amt: 400},];
  

const HomePage = () => {
    const [isLoading, setLoading] = useState(false)
    const [latestWorkflowData, setLatestWorkflowData] = useState({})
    // const [workflowData, setWorkflowData] = useState({})
    // const [chartData, setChartData] = useState()

    useEffect(() => {
        setLoading(true)        
        getData()
        setLoading(false)
    }, [])
    
    const getData = async () => {
        console.log('herererer');
        const workflowData = await getFullTestWorkflowReport()
        // console.log(workflowData);
        // console.log(workflowData.workflow_runs_data[0]);
        // setWorkflowData(workflowData)
        // console.log(workflowData.workflow_runs_data.map(data => ({ name: data.workflow_run.title, data: data.workflow_run.conclusion })));
        // console.log(workflowData.workflow_runs_data.map(data => ({ name: data.workflow_run.title, data: data.workflow_run.conclusion })));
        setLatestWorkflowData(workflowData.workflow_runs_data[0])
    }

    return (
        <div>
            {
                isLoading ? <div>Loading...</div> :
                <div id="main-home">
                    <div id="left">
                        <div className="latest">
                            <div className="run-info">
                                <div>{latestWorkflowData.workflow_run.title}</div>
                                <div>{moment(latestWorkflowData.workflow_run.created).format("MMM. Do YYYY")}</div>
                                <div>{latestWorkflowData.workflow_run.actor_name}</div>
                                <div className="count">
                                    <div>{latestWorkflowData.test_runs.length}</div>
                                    <div>test cases</div>
                                </div>
                            </div>
                            <div className="chart">
                                <div>                                
                                    <PieChart width={250} height={250}>
                                        <Pie
                                            dataKey="pv"
                                            isAnimationActive={false}
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            label
                                        />
                                        <Pie dataKey="pv" data={data} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
                                        <Tooltip />
                                    </PieChart>                                
                                </div>
                            </div>
                        </div>
                        <div className="test-list">
                            {
                                latestWorkflowData.test_runs.map((run) => {
                                    return (
                                        <div style={{ maring: '2px 0', padding: '5px', cursor: 'pointer', borderBottom: '1px solid' }} key={run.test_run.id}>{run.test_run.name}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id="right">
                        <div>
                            <h3>Trends</h3>
                            <LineChart width={800} height={300} data={data}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </div>
                        <div></div>
                    </div>
                </div>
            }
        </div>
    )
}

export default HomePage;