import { useEffect, useState } from 'react';
import axios from 'axios';
import { SweetAlert } from '@utils/SweetAlert';
import { useSelector } from 'react-redux';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { useDropzone } from 'react-dropzone';
import { decodeJWT } from '@/utils/JwtToken';

const VerifyDocument: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  let _token = token || localStorage?.getItem("token");
  const [data, setData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resizeImage = (file: File, targetSizeMB: number) => {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = () => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxFileSize = targetSizeMB * 1024 * 1024;
          let ratio = 1;
  
          while (file.size > maxFileSize && ratio > 0.1) {
            ratio -= 0.1;
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
          }
  
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject("Failed to resize image");
            }
          }, file.type);
        };
        img.src = reader.result as string;
      };
  
      reader.readAsDataURL(file);
    });
  };
  

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        SweetAlert({
          title: "Error!",
          message: "Please upload a PNG or JPG file.",
          type: "error"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        SweetAlert({
          title: "Error!",
          message: "File size exceeds the maximum limit of 10MB.",
          type: "error"
        });
        return;
      }

      resizeImage(file, 1024).then((resizedFile) => {
        setSelectedFile(resizedFile);
        setImagePreview(URL.createObjectURL(resizedFile));
      }).catch((error) => {
        SweetAlert({
          title: "Error!",
          message: "Failed to resize the image",
          type: "error"
        });
      });
    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    if (!selectedFile) {
      setLoading(false);
      SweetAlert({
        title: "Error!",
        message: "Please upload a file!",
        type: "error"
      });
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        let document_base64 = reader.result as string;
  
        const base64Prefix = document_base64.indexOf(",") + 1;
        document_base64 = document_base64.substring(base64Prefix);
  
        try {
          await axios.post(
            'http://localhost:8080/api/verifyDocument',
            {
              document_name: selectedFile.name,
              document_base64,
              document_type: selectedFile.type,
            },
            {
              headers: {
                'Authorization': `Bearer ${_token}`,
                'Content-Type': 'application/json',
              }
            }
          );
  
          SweetAlert({
            title: "Success!",
            message: "Your document has been uploaded successfully.",
            type: "success"
          }).then(() => window.location.href = "/");
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          SweetAlert({
            title: "Error!",
            message: `Upload failed: ${error?.message || 'Unknown error'}`,
            type: "error"
          });
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      setLoading(false);
      SweetAlert({
        title: "Error!",
        message: `Upload failed: ${error.message}`,
        type: "error"
      });
    }
  };
  

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['image/jpeg', 'image/png', 'image/jpg'] as any,
    onDrop,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const fnCheckActiveVerify = async (userId: any) => {
    try {
      const res: any = await axios.post('http://localhost:8080/api/getUserById', { userId }, {
        headers: {
          'Authorization': `Bearer ${_token}`,
          'Content-Type': 'application/json'
        }
      });
      const resData = res.data
      setData(resData);
    } catch (error: any) {
      SweetAlert({
        title: "Error!",
        message: `Register failed: ${error}`,
        type: "error"
      });
    }
  };

  useEffect(() => {
    const userId = decodeJWT();
    fnCheckActiveVerify(userId);
  }, []);

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900 mt-4">Applicant Information</h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and application.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.first_name} {data?.last_name}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Phone</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.phone}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Passport</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.passport}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Address</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.address}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Attachments</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      {selectedFile ? (
                        <div>
                          <a
                            href={imagePreview ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate font-medium text-indigo-600"
                          >
                            {selectedFile.name}
                          </a>
                        </div>
                      ) : (
                        <span className="truncate font-medium">Upload File PNG,JPG</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    {selectedFile ? (
                      <button
                        onClick={handleRemoveFile}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    ) : (
                      <div {...getRootProps()} className="cursor-pointer">
                        <input {...getInputProps()} />
                        <span className="text-indigo-600">Click to Upload</span>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => handleFileUpload()}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyDocument;
