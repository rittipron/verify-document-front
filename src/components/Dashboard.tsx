import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '@redux/slices/authSlice';

const people = [
  {
    "name": "Leslie Alexander",
    "email": "leslie.alexander@example.com",
    "role": "Co-Founder / CEO",
    "imageUrl":
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": "3h ago",
    "lastSeenDateTime": "2023-01-23T13: 23Z"
  },
  {
    "name": "Michael Foster",
    "email": "michael.foster@example.com",
    "role": "Co-Founder / CTO",
    "imageUrl":
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": "3h ago",
    "lastSeenDateTime": "2023-01-23T13: 23Z"
  },
  {
    "name": "Dries Vincent",
    "email": "dries.vincent@example.com",
    "role": "Business Relations",
    "imageUrl":
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": null
  },
  {
    "name": "Lindsay Walton",
    "email": "lindsay.walton@example.com",
    "role": "Front-end Developer",
    "imageUrl":
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": "3h ago",
    "lastSeenDateTime": "2023-01-23T13: 23Z"
  },
  {
    "name": "Courtney Henry",
    "email": "courtney.henry@example.com",
    "role": "Designer",
    "imageUrl":
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": "3h ago",
    "lastSeenDateTime": "2023-01-23T13: 23Z"
  },
  {
    "name": "Tom Cook",
    "email": "tom.cook@example.com",
    "role": "Director of Product",
    "imageUrl":
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "lastSeen": null
  }
]

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  const nextToFromMail = (email:any) => {
    navigate(`/fromemail?id=${email}`);
  }

  useEffect(() => {
    let _token = token
    if(window) _token = localStorage?.getItem("token") 

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard', {
          headers: {
            Authorization: `Bearer ${_token}`,
          },
        });
        setData(response.data);
      } catch (err: any) {
        if (!_token) {
          dispatch(logout());
          localStorage.removeItem("token")
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [dispatch, navigate, token]);

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {people.map((person) => (
        <li key={person.email} onClick={() => nextToFromMail(person.email)} className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-900/10 px-5">
          <div className="flex min-w-0 gap-x-4">
            <img alt="" src={person.imageUrl} className="size-12 flex-none rounded-full bg-gray-50" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">{person.email}</p>
            </div>
          </div>
          <div 
            className="hidden shrink-0 sm:flex sm:flex-col sm:items-end my-auto "
          >
            <span aria-hidden="true">&rarr;</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Dashboard;
