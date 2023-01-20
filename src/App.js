/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import FunctionalTestsPage from './pages/FunctionalTestsPage';
import WorkflowHistoryPage from './pages/WorkflowHistoryPage';
import ReleasePage from './pages/ReleasePage';

const App = () => {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/workflows/:workflowId' element={<WorkflowHistoryPage />} />
          <Route path='/functional-tests' element={<FunctionalTestsPage />} />
          <Route path='/release' element={<ReleasePage />} />
        </Routes>
      
    </div>
  );
}

export default App;
