import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelect from "react-select/creatable";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const initialOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

function FromEmail() {
  const { handleSubmit } = useForm();
  const [selectedOptionsTo, setSelectedOptionsTo] = useState<any>([]);
  const [selectedOptionsCC, setSelectedOptionsCC] = useState<any>([]);
  const [value, setValue] = useState('');

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        to: selectedOptionsTo,
        cc: selectedOptionsCC,
        html: value,
      });

      const { token, user } = response.data;
    } catch (error: any) {
      console.error('Login failed:', error); 
    }
  };

  const handleChange = (newValue: any, setStateFn: any) => {
    setStateFn(newValue || []);
  };

  const handleCreate = (inputValue: any, setStateFn: any) => {
    const newOption = { value: inputValue, label: inputValue };
    setStateFn((prev: any) => [...prev, newOption]);
  };

  const handleBlur = (event: any, dataOption: any, setStateFn: any) => {
    const selectedOptions = dataOption
    const inputValue = event.target.value.trim();
    if (inputValue && !selectedOptions.some((option: any) => option.value === inputValue)) {
      handleCreate(inputValue, setStateFn);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromURL = params.get("id");

    if (idFromURL) {
      setSelectedOptionsTo([{ value: idFromURL, label: idFromURL }]);
    }else{
      setSelectedOptionsTo([]);
      setSelectedOptionsCC([]);
      setValue('');
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">From Send Email</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            This information template email for send
          </p>

          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                TO :
              </label>
              <div className="mt-2 grid grid-cols-1">
                <CreatableSelect
                  isMulti
                  isClearable
                  options={initialOptions} // ใช้เฉพาะตัวเลือกที่มีอยู่ใน options เริ่มต้น
                  value={selectedOptionsTo}
                  onChange={(e) => handleChange(e, setSelectedOptionsTo)}
                  onCreateOption={(e) => handleCreate(e, setSelectedOptionsTo)}
                  onBlur={(e) => handleBlur(e, selectedOptionsTo, setSelectedOptionsTo)}
                  placeholder="Select or create options..."
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                CC
              </label>
              <div className="mt-2 grid grid-cols-1">
                <CreatableSelect
                  isMulti
                  isClearable
                  options={initialOptions}
                  value={selectedOptionsCC}
                  onChange={(e) => handleChange(e, setSelectedOptionsCC)}
                  onCreateOption={(e) => handleCreate(e, setSelectedOptionsCC)}
                  onBlur={(e) => handleBlur(e, selectedOptionsCC, setSelectedOptionsCC)}
                  placeholder="Select or create options..."
                  formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                About
              </label>
              <div className="mt-2">
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  modules={modules}
                  formats={formats}
                  style={{ height: '300px', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm/6 font-semibold text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

export default FromEmail