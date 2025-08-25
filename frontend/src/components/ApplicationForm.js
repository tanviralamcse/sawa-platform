import React from 'react';

export default function ApplicationForm() {
  return (
    <div>
      <h2>Apply to Service Request</h2>
      {/* Form fields: pitch, comments, availability, price adjustment, suggested date */}
      <form>
        <div>
          <label>Why should you be selected?</label>
          <textarea name="pitch" />
        </div>
        <div>
          <label>Additional comments or questions?</label>
          <textarea name="comments" />
        </div>
        <div>
          <label>Available on preferred date?</label>
          <input type="checkbox" name="available" />
        </div>
        <div>
          <label>Suggested date</label>
          <input type="date" name="suggested_date" />
        </div>
        <div>
          <label>Price adjustment (€)</label>
          <input type="number" name="price_adjustment" />
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
