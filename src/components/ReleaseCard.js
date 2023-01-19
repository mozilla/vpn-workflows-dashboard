/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaGithub, FaRegClock, FaJira } from "react-icons/fa";

const ReleaseCard = ({ commitObject }) => {
  const [commit, setCommit] = useState([]);  
  const [jiraIssue, setJiraIssue] = useState("")
  const [pullNumber, setPullNumber] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    setCommit(commitObject.commit);

    const message = commitObject.commit.message
    setTitle(message.split("*")[0])
    if(message.includes('VPN-')){
      setJiraIssue(message.match(/VPN-(\d+(\.\d+)?)/g)[0])
            
      /*eslint-disable */
      const tempTitle = message.split("*")[0]
      const titleArr = tempTitle.match(/\B\#\w\w+\b/g)      

      if(titleArr!== null){
        const trimmedTitle = titleArr[0].replace('#', "")
        console.log(trimmedTitle);
        setPullNumber(trimmedTitle)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      key={commitObject.sha}
      style={{
        boxShadow: "0 15px 50px rgba(0,0,0,0.35)",
        borderRadius: 10,
        padding: "1rem",          
      }}
    >
      {commit.author && (
        <>
          <div style={{textDecoration: 'none', color: '#000', width: 308, height: 60}}>
            <a href={`https://github.com/mozilla-mobile/mozilla-vpn-client/pull/${pullNumber}`} target="_blank" rel="noreferrer noopener">
              {title}
            </a>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 10px",
              alignItems: "center",
            }}
          >
            <div className="card-title-section">
              <div className="card-title"></div>
            </div>
          </div>
          <div className="workflow-info">
            <div className="info-sec">
              <div>
                <FaGithub />
              </div>
              <div>
                  {commit.author.name}
              </div>
            </div>
            <div className="info-sec">
              <div>
                <FaRegClock />
              </div>
              <div>{moment(commit.author.date).format("MMMM Do, YYYY")}</div>
            </div>
            <div className="info-sec">
              <div>
                <FaJira />
              </div>
              <div>
              <a
                  href={jiraIssue ? `https://mozilla-hub.atlassian.net/browse/${jiraIssue}` : null}
                  target="_blank"
                  rel="noreferrer noopener"
                >                  
                {jiraIssue ? jiraIssue : 'No Jira Ticket'}
                </a>
              </div>
            </div>
          </div>
          <hr className="divider" />
        </>
      )}
    </div>
  );
};

export default ReleaseCard;
