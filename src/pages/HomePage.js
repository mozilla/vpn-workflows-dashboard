/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { getAllWorkflows, getAllWorkflowsStats } from "../api/githubService";
import WorkflowCard from "../components/WorkflowCard";

const HomePage = () => {
  const [isLoading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [workflowsStats, setWorkflowsStats] = useState({});

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);

    getAllWorkflows()
      .then((workflow_runs) => {
        setWorkflows(workflow_runs);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    getAllWorkflowsStats()
      .then((workflows_stats) => {
        setWorkflowsStats(workflows_stats);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    setLoading(false);
  };

  return (
    <div>
      <div style={{ margin: "10px 0", fontWeight: "bold", fontSize: 30 }}>
        VPN Workflows Dashboard
      </div>

      <div style={{ fontSize: 13, color: '#b3b3b3', fontWeight: 'bold' }}>
        <div>Latest: {workflowsStats.display_title}</div>
        <div>
          Date: {moment(workflowsStats.created_at).format("MMMM Do YYYY")}
        </div>
        <div>Duration: {workflowsStats.duration}</div>
        <div>Author: {workflowsStats.author}</div>
      </div>

      <div id="workflows-container">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          workflows.map((workflow) => {
            return <WorkflowCard key={workflow.node_id} workflow={workflow} />;
          })
        )}
      </div>
    </div>
  );
};

export default HomePage;