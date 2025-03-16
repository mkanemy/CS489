import React, { useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  fileRef?: React.RefObject<HTMLInputElement | null>;
  onFilesDrop?: (files: File[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ fileRef, onFilesDrop }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles); // keep local state (if needed)
    if (onFilesDrop) {
      onFilesDrop(acceptedFiles); // send files to parent
    }
    console.log(acceptedFiles);
  }, [onFilesDrop]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => {}, // Default empty handlers
    onDragLeave: () => {},
    onDragOver: () => {},
    multiple: true, 
  });
  
  const handleDownload = (file: File): void => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #888',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input ref={fileRef} {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Dropped Files</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleDownload(file)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit'
                }}
              >
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileDropzone;
