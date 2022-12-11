/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import FunctionalTestsPage from './pages/FunctionalTestsPage';
import WorkflowHistoryPage from './pages/WorkflowHistoryPage';

const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/workflows/:workflowId' element={<WorkflowHistoryPage />} />
          <Route path='/functional-tests' element={<FunctionalTestsPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
