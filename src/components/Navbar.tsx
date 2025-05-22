import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@redux/slices/authSlice';
import { RootState } from '@redux/store';

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { decodeJWT } from '@/utils/JwtToken';
import axios from 'axios';
import { SweetAlert } from '@/utils/SweetAlert';



const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  let _token = token
  if (window) _token = localStorage?.getItem("token")

  const handleLogout = () => {
    setMobileMenuOpen(false)
    localStorage.removeItem("token")
    dispatch(logout());
    navigate('/login');
  };

  const fnCheckActiveVerify = async (userId:any) => {
    try {
      const res:any = await axios.post('http://localhost:8080/api/getUserById', {userId},{
        headers: {
          'Authorization': `Bearer ${_token}`,
          'Content-Type': 'application/json'
        }
      });
      const resData = res.data 
      if(!resData?.active || resData?.active == 0){
        navigate('/verify');
      }
      setActive(resData?.active)
    } catch (error: any) {
      SweetAlert({
        title: "Error!",
        message: `Register failed: ${error}`,
        type: "error"
      })
    }
  }

  const fnCheckNav = () => {
    if(_token && active) return true
    else return false
  }

  useEffect(()=>{
    const userId = decodeJWT();
    fnCheckActiveVerify(userId);
  },[])

  return (
    <>
      { fnCheckNav() && (
        <header className="bg-white mb-5">
          <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1 h-8">
              {!mobileMenuOpen && <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '') + ' -m-1.5 p-1.5'}
              >
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </NavLink>
              }
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '') + ' text-sm/6 font-semibold text-gray-900'}
              >
                Home
              </NavLink>
              <a
                href="/fromemail"
                className="text-sm/6 font-semibold text-gray-900'"
              >
                From Email
              </a>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : '') + ' text-sm/6 font-semibold text-gray-900'}
              >
                Profile
              </NavLink>
            </PopoverGroup>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a href="#" onClick={() => handleLogout()} className="">
                Log out <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
          <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-10" />
            <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <NavLink
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => (isActive ? 'active' : '') + ' -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'}
                    >
                      Home
                    </NavLink>
                    <a
                      href="/fromemail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'"
                    >
                      From Email
                    </a>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => (isActive ? 'active' : '') + ' -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'}
                    >
                      Profile
                    </NavLink>
                  </div>
                  <div className="py-6">
                    <a href="#" onClick={() => handleLogout()} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Log out <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>

        </header>
      )
      }
    </>
  );
};

export default Navbar;
