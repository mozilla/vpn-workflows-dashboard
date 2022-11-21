import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { getFullTestWorkflowReport } from '../api/functional_tests'
import HomeComponent from '../components/HomeComponent';
// const data = [{name: 'Page A', uv: 500, pv: 2800, amt: 3400}, {name: 'Page B', uv: 100, pv: 700, amt: 3000}, {name: 'Page C', uv: 200, pv: 800, amt: 400}];

const HomePage = () => {
    const [isLoading, setLoading] = useState(false)
    const [isLoadingFlakes, setLoadingFlakes] = useState(false)
    const [latestWorkflowData, setLatestWorkflowData] = useState({})
    const [testHistory, setTestHistory] = useState({})
    const [passPercentage, setPassPercentage] = useState(0)
    const [chartData, setChartData] = useState()

    useEffect(() => {
        getData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const getData = () => {
        setLoading(true)
        getFullTestWorkflowReport().then((workflowData) => {
            // console.log(workflowData);
            // console.log('herererer', workflowData.workflow_runs_data[0]);
            // console.log(workflowData.workflow_runs_data.map((data, idx) => console.log(data)));
            // console.log(workflowData.workflow_runs_data.map((data, idx) => ({ name: data.test_runs[idx].test_run.name, counts: data.passed_count })));
            let cData = workflowData.workflow_runs_data.map((data, idx) => ({ name: `${moment(data.workflow_run.started).format('L')} - ${data.workflow_run.title}`, passed: data.passed_count, flakes: data.flaked_count, failures: data.failed_count, date: moment(data.workflow_run.started).format('L') }))

            const passPerc = Math.floor((workflowData.workflow_runs_data[0].passed_count / workflowData.workflow_runs_data[0].test_runs.length) * 100)
            setPassPercentage(passPerc)
            buildTestRuns(workflowData.workflow_runs_data)
            setChartData(cData.reverse())
            setLatestWorkflowData(workflowData.workflow_runs_data[0])
            setLoading(false)
        }).catch(err => console.log(err))
    }

    const buildTestRuns = (workflows) => {
        setLoadingFlakes(true)
        let flakes = []
        for(let i =0; i<workflows.length; i++){
            const workflow = workflows[i]
            if(workflow.flaked_count > 0 || workflow.failed_count > 0){
                const test_runs = workflow.test_runs
                for(let j=0; j<test_runs.length; j++){
                    const test_run = test_runs[j]

                    if(test_run.test_flake_history.length){
                        // console.log(test_run);
                        const testFlakeHistory = {
                            test_commit: workflow.workflow_run.title,
                            test_commit_actor: workflow.workflow_run.actor_name,
                            test_name: test_run.test_name,
                            test_failed_count: 0,
                            test_flaked_count: 0,
                            test_date: test_run.test_completed,
                            tests_error_messages: test_run.test_annotations
                        }
        
                        for(let k=0; k<test_run.test_annotations.length; k++){
                            const annotation = test_run.test_annotations[k]
                            // console.log(annotation.annotation_level);
                            if(annotation.annotation_level === 'warning'){
                                testFlakeHistory.test_flaked_count++
                            } 
                            
                            if(annotation.annotation_level === 'failure') {
                                testFlakeHistory.test_failed_count++
                            }
                        }

                        flakes.push(testFlakeHistory)
                    }
                }
            }
        }

        let combinedTests = flakes.reduce(function(acc, curr) {
            let findIndex = acc.findIndex(function(item) {
              return item.test_commit === curr.test_commit
            })
          
            if (findIndex === -1) {
              acc.push(curr)
            } else {
              acc[findIndex] = (Object.assign({}, acc[findIndex], curr))
          
            }
          
          
            return acc;
          }, [])

        setTestHistory(combinedTests)
        setLoadingFlakes(false)
    }

    return (
        <div>
            {
                isLoading ? <div>Loading...</div> :
                <HomeComponent 
                    latestWorkflowData={latestWorkflowData} 
                    chartData={chartData} 
                    isLoadingFlakes={isLoadingFlakes} 
                    testHistory={testHistory} 
                    passPercentage={passPercentage}  />
            }
        </div>
    )
}

export default HomePage;