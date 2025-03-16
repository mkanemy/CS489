import { Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  fileRef?: React.RefObject<HTMLInputElement | null>;
  setDroppedFiles: (files: File[]) => void;
  droppedFiles: File[];
  setErrorMsg: (val: string) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ fileRef, setDroppedFiles, droppedFiles, setErrorMsg }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMsg('');
    setDroppedFiles(acceptedFiles);
  }, [setDroppedFiles]);
  
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
    <div style={{ maxWidth: '100%' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #888',
          padding: '20px 0 20px 0',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input ref={fileRef} {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
        {isDragActive ? (
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
            Drop here...
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
            Drag files here, or click to select files
          </Typography>
        )}
      </div>
      {(droppedFiles.length != 0) &&
        <div style={{ marginTop: '5px' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
            Dropped Files:
          </Typography>
          <ul style={{margin: 0, paddingLeft: '20px'}}>
            {droppedFiles.map((file, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleDownload(file)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 'inherit'
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                    {file.name.length <= 40 ? file.name : file.name.slice(0, 37) + '...'}
                  </Typography>
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};

export default FileDropzone;
