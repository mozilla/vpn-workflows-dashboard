/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import { getReleaseDiffsAsync } from "../api/githubService";
import ReleaseCard from "../components/ReleaseCard";

const ReleasePage = () => {
  const [diffs, setDiffs] = useState({})
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    let jc = [];

    getReleaseDiffsAsync()
      .then((diffs) => {
        if (diffs) {
          setDiffs(diffs)
          const cm = [...diffs.commits];
          const rcm = cm.reverse();
          setCommits(rcm);

          for (let rc of rcm) {
            const message = rc?.commit?.message;
            if (message.includes("VPN-")) {
              jc.push(rc);
            }
          }
          
        }
      })
      .catch((err) => {        
        console.log(err);
      });    
  };

  return (
    <div>
      <div style={{ margin: "10px 0", fontWeight: "bold", fontSize: 30 }}>
        VPN releases/2.13.0 Dashboard
      </div>

      {commits.length < 1 ? (
        <div className="loader"></div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#b3b3b3", fontWeight: "bold" }}>
            <div>
              <a
                href={diffs.diff_url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Github Diffs Page
              </a>
            </div>
            <div>total commits: {diffs.total_commits}</div>
          </div>

          <div id="workflows-container">
            {commits.map((commit, idx) => {
                  return (
                    <ReleaseCard
                      key={idx}
                      commitObject={commit}
                    />
                  )
                })}
          </div>
        </>
      )}
    </div>
  );
};

export default ReleasePage;
