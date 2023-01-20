/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import moment from "moment";
import React from "react";
import { FaGithub, FaRegClock, FaRegCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { calculateDuration } from "../utilities/helpers";

const statuses = {
  success: "success-css",
  in_progress: "progress-css",
  queued: "queued-css",
  failure: "failure-css",
};

const statusColors = {
  success: "#17ca80",
  in_progress: "#ffbf00",
  cancelled: "#b3b3b3",
  failure: "#f47169",
};

const WorkflowCard = ({ workflow }) => {
  let navigate = useNavigate();

  const openHistory = (wf) => {
    if (wf.name === "Functional tests") {
      navigate("/functional-tests");
    } else {
      navigate(`/workflows/${wf.workflow_id}`);
    }
  };

  return (
    <div
      key={workflow.node_id}      
      style={{
        boxShadow: "0 15px 50px rgba(0,0,0,0.35)",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px 10px",
          alignItems: "center",
        }}
      >
        <div className="card-title-section">
          <div className="card-title" onClick={() => openHistory(workflow)} >{workflow.name}</div>
        </div>
        <div
          className={
            statuses[
              workflow.conclusion === null
                ? workflow.status
                : workflow.conclusion
            ]
          }
        ></div>
      </div>
      <div className="workflow-info">
        <div className="info-sec">
          <div>
            <FaGithub />
          </div>
          <div><a href={workflow.html_url} target="_blank" rel="noreferrer noopener">{workflow.name} workflow HTML page</a></div>
        </div>
        <div className="info-sec">
          <div>
            <FaRegClock />
          </div>
          <div >{calculateDuration({
                  start: workflow.run_started_at,
                  end: workflow.updated_at,
                })}</div>
        </div>
        <div className="info-sec">
          <div style={{ fontSize: 11, color: '#D3D3D3', marginLeft: 2, fontWeight: 'bold' }}>
            {moment(workflow.updated_at).fromNow()}
          </div>
        </div>         
      </div>
      <hr className="divider" />
        <div style={{ fontSize: 10, fontWeight: 'bold' }}>Last 10 {workflow.name} workflow runs:</div>
      <div className="history-sec">
        {
          workflow.runs.reverse().map((run, idx) => {
            return <div style={{ cursor: 'pointer' }} key={idx} onClick={() =>
              window.open(run.html_url)
            }>
              <FaRegCheckCircle color={statusColors[run.conclusion]} />
            </div>
          })
        }
      </div>
    </div>
  );
};

export default WorkflowCard;
