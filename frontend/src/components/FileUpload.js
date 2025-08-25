import React, { useState } from 'react';

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const handleChange = e => {
    setFiles(Array.from(e.target.files));
  };
  return (
    <div>
      <label>Upload Files</label>
      <input type="file" multiple onChange={handleChange} />
      <div>
        {files.map((file, idx) => (
          <div key={idx}>
            {file.type.startsWith('image') ? (
              <img src={URL.createObjectURL(file)} alt={file.name} width={64} />
            ) : (
              <span>📄 {file.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
