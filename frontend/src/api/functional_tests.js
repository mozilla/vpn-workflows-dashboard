import axios from 'axios'
import moment from 'moment';
import data from '../data/data.json'

async function _getSingleWorkflow(workflowId) {
    const singleWorkflowRunApi = `https://api.github.com/repos/mozilla-mobile/mozilla-vpn-client/actions/workflows/${workflowId}/runs?branch=main`    
    let return_data = {
        fetched: Date.now(),
        workflow_runs: []
    };

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
    
                return_data.workflow_runs.push(workflow_run)


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
    let return_data = {
        fetched: Date.now(),
        check_runs: []
    };
    
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
    
                return_data.check_runs.push(run)
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
    let return_data = {
        fetched: Date.now(),
        run_annotations: []
    };
    
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

            return_data.run_annotations.push(annotation)
        }        
    } catch(err){
        console.log('Unable to fetch getSingleWorkflow', err);
        return
    }
    
    return return_data;
}

/// full api
export async function getFullTestWorkflowReport() {
    let return_data = {        
        fetched: moment().format(),        
        workflow_runs_data: []
    };

    if(!_isOutsideTimeWindow){
        return_data.fetch_message = "Its too early to request again, clear expiretime";
        return_data.workflow_runs_data = data
        return return_data;
    }

    if(await _checkForUpdate()){        
        return_data.fetch_message = "No New Workflows Available";
        return_data.workflow_runs_data = data
        return return_data;
    }
    
    try {
        // get latest workflow runs for main branch
        const workflows = await _getSingleWorkflow(5937682)
        // get checks (functional test matrix run) for each workflow run
        for(let i=0; i < workflows.workflow_runs.length; i++){
            let workflow = {
                workflow_run: {},
                test_runs: []
            }
            workflow.workflow_run = workflows.workflow_runs[i];
            const delayTime = Math.floor(Math.random() * 1000) + 200
            console.log('line 189 delaytime', delayTime)
            _delay(delayTime)
            const checkRuns = await _getWorkflowCheckRuns(workflow.workflow_run.check_suite_id)
            for(let j=0; j < checkRuns.check_runs.length; j++){
                let test = {
                    test_run: {},
                    test_annotations: []
                }

                if(checkRuns.check_runs[j].annotations > 0){
                    test.test_run = checkRuns.check_runs[j]
                    const delayTime = Math.floor(Math.random() * 1000) + 200
                    console.log('line 197 delaytime', delayTime)
                    _delay(delayTime)
                    const annotations = await _getWorkflowCheckRunAnnotation(test.test_run.id)
                    test.test_annotations = annotations.run_annotations

                    workflow.test_runs.push(test) 
                }

            }

            return_data.workflow_runs_data.push(workflow)
        }        

    } catch(err){
        console.log('Unable to fetch getFullTestWorkflowReport', err);
        return_data.message = "Unable to fetch getFullTestWorkflowReport"        
        return return_data
    }

    // save to json file
    const expireTime = moment().add(30, 'm').valueOf()
    window.localStorage.setItem('expireTime', expireTime)
    window.localStorage.setItem('workflows', JSON.stringify(return_data))
    const new_return_data = await _appendDataJson(return_data.workflow_runs_data)
    return new_return_data;
}

async function _isOutsideTimeWindow() {
    // fetch data only within 45 min intervals for same machine
    const existingExpireTime = window.localStorage.getItem('expireTime')
    const fortyFiveMinsAgo = moment().subtract(45, 'minutes').valueOf()        

    if(existingExpireTime && existingExpireTime < fortyFiveMinsAgo){
        return true
    }
}

async function _checkForUpdate() {
    const rawOrigData = window.localStorage.getItem('workflows')

    if(!rawOrigData){
        return false
    }

    const origData = JSON.parse(rawOrigData)
    const apiData = await _getSingleWorkflow(5937682)

    const firstOrigData = origData.workflow_runs_data[0].workflow_run.id
    const firstApiData = apiData.workflow_runs[0].id

    return firstApiData === firstOrigData
}

async function _appendDataJson(newData) {
    let parsedOrigData;

    // read from file
    const rawOrigData = window.localStorage.getItem('workflows')

    if(rawOrigData){    
        parsedOrigData = JSON.parse(rawOrigData)
        parsedOrigData.fetched = Date.now()
        parsedOrigData.workflow_runs_data.unshift(newData)

        // write back to file
        const stringModData = JSON.stringify(parsedOrigData);
        window.localStorage.setItem('workflows', stringModData)        
    }


    return parsedOrigData
}

const _delay = ms => new Promise(res => setTimeout(res, ms));