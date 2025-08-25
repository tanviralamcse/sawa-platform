import React, { useState } from 'react';

export default function AssignmentConfirmation() {
  const [status, setStatus] = useState('assigned');
  const nextStatus = () => {
    if (status === 'assigned') setStatus('in_progress');
    else if (status === 'in_progress') setStatus('completed');
  };
  return (
    <div>
      <h2>Assignment Status: {status.replace('_', ' ')}</h2>
      <button onClick={nextStatus} disabled={status === 'completed'}>
        {status === 'assigned' ? 'Start Job' : status === 'in_progress' ? 'Complete Job' : 'Job Completed'}
      </button>
    </div>
  );
}
