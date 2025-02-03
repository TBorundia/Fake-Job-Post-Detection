import { useState } from 'react';
import JobForm from './components/JobForm';
import JobResult from './components/JobResult';
import Navbar from './components/Navbar';
import './styles/CompleteBackend.css';

function CompleteBackend() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="completeBackend">
      <Navbar />
      <main>
        <JobForm 
          setJobData={setJobData}
          setLoading={setLoading}
          setError={setError}
        />
        {loading && (
          <div className="loading-message">
            Analyzing job posting...
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {jobData && <JobResult jobData={jobData} />}
      </main>
    </div>
  );
}

export default CompleteBackend;