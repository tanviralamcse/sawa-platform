import React from 'react';

export default function ReviewForm({ role }) {
  return (
    <div>
      <h2>Submit a Review ({role})</h2>
      <form>
        <div>
          <label>Overall Rating (1-5)</label>
          <input type="number" min="1" max="5" name="rating_overall" />
        </div>
        <div>
          <label>Comments</label>
          <textarea name="comment" />
        </div>
        <div>
          <label>Metrics</label>
          <input type="text" name="metrics" placeholder="Work Quality, Communication, etc." />
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
