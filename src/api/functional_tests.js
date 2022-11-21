import axios from 'axios'
import moment from 'moment';

async function _getSingleWorkflow(workflowId) {
    const singleWorkflowRunApi = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/actions/workflows/${workflowId}/runs?branch=main`    
    let return_data = [];

    try {
        const { data } = await axios.get(singleWorkflowRunApi)
        for(let i=0; i < 12; i++){
            const workflow = data.workflow_runs[i]
            if(workflow.conclusion !== 'cancelled'){
                const workflow_run = {
                    id: workflow.id,
                    workflow_id: workflow.workflow_id,
                    check_suite_id: workflow.check_suite_id,
                    name: workflow.name,
                    started: workflow.run_started_at,
                    title: workflow.display_title,
                    status: workflow.status,
                    conclusion: workflow.conclusion,
                    branch: workflow.head_branch,
                    actor_email: workflow.head_commit.author.email,
                    actor_name: workflow.head_commit.author.name,
                    actor_message: workflow.head_commit.message,
                    actor_commit_time: workflow.head_commit.timestamp,
                    sha: workflow.sha,
                    event: workflow.event,
                    node_id: workflow.node_id,
                    url: workflow.url,
                    html_url: workflow.html_url,
                    created: workflow.created_at,
                    updated: workflow.updated_at,
                    run_attempt: workflow.run_attempt,
                    referenced_wf: workflow.referenced_workflows[0],
                    triggering_actor: workflow.triggering_actor.login,
                    jobs_url: workflow.jobs_url,
                    logs_url: workflow.logs_url,
                    workflow_url: workflow.workflow_url            
                }
    
                return_data.push(workflow_run)


            }
        }        
    } catch(err){
        console.log('Unable to fetch getSingleWorkflow', err);
        return
    }

    // save to json file
    return return_data;
}

async function _getWorkflowCheckRuns(checkSuiteId) {
    const workflowCheckRunsApi = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/check-suites/${checkSuiteId}/check-runs`    
    let return_data = [];
    
    try {
        const { data } = await axios.get(workflowCheckRunsApi)
        for(let i=0; i < data.check_runs.length; i++){
            const check_run = data.check_runs[i]
            if(check_run.name !== 'Build Test Client'){
                const run = {
                    id: check_run.id,
                    name: check_run.name,
                    status: check_run.status,
                    conclusion: check_run.conclusion,
                    head_sha: check_run.head_sha,
                    started: check_run.started_at,
                    completed: check_run.completed_at,
                    annotations: check_run.output.annotations_count
                }
    
                return_data.push(run)
            }
        }        
    } catch(err){
        console.log('Unable to fetch getSingleWorkflow', err);
        return
    }
        
    return return_data;
}

async function _getWorkflowCheckRunAnnotation(checkRunId) {
    const workflowCheckRunAnnotationApi = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/check-runs/${checkRunId}/annotations`    
    let return_data = [];
    
    try {
        const { data } = await axios.get(workflowCheckRunAnnotationApi)        
        for(let i=0; i < data.length; i++){
            const run_annotation = data[i]
            const annotation = {
                message: run_annotation.message,
                annotation_level: run_annotation.annotation_level,
                start_line: run_annotation.start_line,
                end_line: run_annotation.end_line
            }

            return_data.push(annotation)
        }        
    } catch(err){
        console.log('Unable to fetch getSingleWorkflow', err);
        return
    }
    
    return return_data;
}

/// full api
export const getFullTestWorkflowReport = async () => {
    console.log('inside line 123');
    let return_data = {        
        fetched: moment().format().valueOf(),        
        workflow_runs_data: []
    };

    if(await _getLocalData()){
        console.log('line 130');        
        const localData = await _getDataFromLocal()
        return_data.fetch_message = "Its too early to request again, clear expiretime";
        return_data.workflow_runs_data = localData.workflow_runs_data
        return return_data;
    }

    // console.log('line 136');
    // if(await _checkForUpdate()){
    //     console.log('line 139');
    //     const localData = await _getDataFromLocal() 
    //     return_data.fetch_message = "No New Workflows Available";
    //     return_data.workflow_runs_data = localData.workflow_runs_data
    //     return return_data;
    // }
    
    console.log('line 144');
    try {
        console.log('new updates detected get new data');
        // get latest workflow runs for main branch
        const workflows = await _getSingleWorkflow(5937682)
        // get checks (functional test matrix run) for each workflow run
        for(let i=0; i < workflows.length; i++){
            let workflow = {
                workflow_run: {},
                test_runs: [],                
                passed_count: 0,
                failed_count: 0,
                flaked_count: 0
            }

            workflow.workflow_run = workflows[i];
            const delayTime = Math.floor(Math.random() * 1000) + 200
            // console.log('line 189 delaytime', delayTime)
            _delay(delayTime)
            
            // console.log('line 154', workflow.workflow_run.check_suite_id);
            const checkRuns = await _getWorkflowCheckRuns(workflow.workflow_run.check_suite_id)
            // console.log('line 156');
            for(let j=0; j < checkRuns.length; j++){
                // console.log('line 158');
                let test = {
                    test_run: {},
                    test_annotations: [],
                    test_flake_history: [],
                    test_flaked_count: 0,
                    test_failed_count: 0,
                    test_passed_count: 0,
                }            

                // console.log('line 164', checkRuns[j]);
                test.test_run = checkRuns[j]
                test.test_name = checkRuns[j].name
                test.test_started = checkRuns[j].started
                test.test_completed = checkRuns[j].completed
                if(test.test_run.annotations > 0){
                    let flake = {
                        flakes: 0,
                        failures: 0,
                        messages: [],
                        start_line: [],
                        end_line: [],
                    }

                    let message = {}

                    const delayTime = Math.floor(Math.random() * 1000) + 200
                    console.log('line 197 delaytime', delayTime)
                    _delay(delayTime)
                    const annotations = await _getWorkflowCheckRunAnnotation(test.test_run.id)
                    test.test_annotations = annotations
                    workflow.flaked_count += annotations.length
                    flake.test_name = test.test_run.test_name;

                    for(let k = 0; k < annotations.length; k++){
                        if(annotations[k].annotation_level === 'warning'){
                            flake.flakes++
                            message.info = annotations[k].message
                            message.start_line = annotations[k].start_line
                            message.end_line = annotations[k].end_line
                            flake.messages.push(message)
                        }
                        
                        if(annotations[k].annotation_level === 'failure'){
                            flake.failures++
                            message.info = annotations[k].message
                            message.start_line = annotations[k].start_line
                            message.end_line = annotations[k].end_line
                            flake.messages.push(message)
                        }

                        test.test_flake_history.push(flake)
                    }
                }

                workflow.test_runs.push(test)

                if(checkRuns[j].conclusion === "success"){
                    workflow.passed_count += 1
                    test.test_passed_count += 1
                } else {
                    workflow.failed_count += 1
                    test.test_failed_count += 1
                }
            }
            
            return_data.workflow_runs_data.push(workflow)
        }        

        console.log('line 188');
    } catch(err){
        console.log('Unable to fetch getFullTestWorkflowReport', err);
        return_data.message = "Unable to fetch getFullTestWorkflowReport"        
        return return_data
    }

    // save to json file
    
    // const oldArray = window.localStorage.getItem('workflows')
    // if(oldArray){

    // }
    // const newArray = return_data.workflow_runs_data
    // let new_return_data = await _appendDataJson(return_data.workflow_runs_data)
    console.log('line 203');
    window.localStorage.setItem('expireTime', moment().add(30, 'm').valueOf())
    window.localStorage.setItem('workflows', JSON.stringify(return_data))
    return return_data;
}

async function _getLocalData() {
    // fetch data only within 45 min intervals for same machine
    console.log('line 217');
    const existingExpireTime = window.localStorage.getItem('expireTime')
    const fortyFiveMinsAgo = moment().subtract(45, 'minutes').valueOf()
    
    if(!existingExpireTime){
        console.log('no expiry time, make new request');
        return false
    } else if(existingExpireTime && existingExpireTime > fortyFiveMinsAgo){
        console.log('is within of expire time, get from local');
        return true
    } else {
        console.log('linec226');
        console.log('not outside of expiry');
        return false
    }

}

// async function _checkForUpdate() {
//     const rawOrigData = window.localStorage.getItem('workflows')

//     if(!rawOrigData){
//         return false
//     }

//     const origData = JSON.parse(rawOrigData)    
//     const apiData = await _getSingleWorkflow(5937682)

//     const firstOrigData = origData.workflow_runs_data[0].workflow_run.id
//     const firstApiData = apiData.workflow_runs[0].id

//     return firstApiData === firstOrigData
// }

async function _getDataFromLocal() {
    const rawOrigData = window.localStorage.getItem('workflows')

    if(!rawOrigData){
        return false
    }

    // console.log(JSON.parse(rawOrigData));
    return JSON.parse(rawOrigData)    
}

// const buildTestRun = async (arg) => {

// }

// const buildWorkflowRun = async (arg) => {

// }

const _delay = ms => new Promise(res => setTimeout(res, ms));