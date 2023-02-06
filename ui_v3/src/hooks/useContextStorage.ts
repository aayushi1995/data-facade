import { useContext, useState } from "react";
import { DataContext, SetDataContext } from "../utils/DataContextProvider";

function useContextStorageFile(fileKey: string) {
  const [file, setFile] = useState(null);
  const setDataContext = useContext(SetDataContext);
  const dataContext = useContext(DataContext);

  const [fileName, setFileName] = useState( dataContext?.fileName|| null);

  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];
    setFileName(uploadedFile["name"]);
    const reader = new FileReader();

    reader.onload = (e: any) => {
      setDataContext({
        type:'SetFile',
        payload:{
          fileURL:e.target.result
        }
      })
      setDataContext({
        type:'SetFileName',
        payload:{
          fileName:uploadedFile["name"]
        }
      })
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleFileRetrieval = () => {
    const dataURL = dataContext?.fileURL;
    if (!dataURL) return;
    const retrievedFile: any = dataURLToFile(dataURL, fileName);
    return retrievedFile;
  };

  const dataURLToFile = (dataURL: string, fileName: any) => {
    const arr: any = dataURL.split(",");
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n -= 1;
    }

    return new File([u8arr], fileName, { type: "text/csv" });
  };

  return [file, handleFileUpload, handleFileRetrieval];
}

export default useContextStorageFile;
