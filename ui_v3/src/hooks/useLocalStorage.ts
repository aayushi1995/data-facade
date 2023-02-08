import { useState } from "react";

function useLocalStorageFile(fileKey: string) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(localStorage.getItem('fileName')||null);

  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];
    setFileName(uploadedFile["name"]);
    const reader = new FileReader();

    reader.onload = (e: any) => {
      localStorage.setItem(fileKey, e.target.result);
      localStorage.setItem('fileName', uploadedFile["name"]);
    };

    reader.readAsDataURL(uploadedFile);
    setFile(uploadedFile);
  };

  const handleFileRetrieval = () => {
    const dataURL = localStorage.getItem(fileKey);
    if (!dataURL) return;
    const retrievedFile: any = dataURLToFile(dataURL, fileName);
    // setFile(retrievedFile);
    return retrievedFile
  };

  const dataURLToFile = (dataURL: string, fileName: any) => {
    const arr:any = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n -= 1;
    }

    return new File([u8arr], fileName, {type: "text/csv"} );
  };

  return [file, handleFileUpload, handleFileRetrieval];
}

export default useLocalStorageFile;
