import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '@/components/Login'
import { isTokenValid } from '@/utils/JwtToken';

function LoginPage() {
    const navigate = useNavigate();
    const token = useSelector((state: any) => state.auth.token);
  
    let _token = token
    if(window) _token = localStorage?.getItem("token")

    useEffect(() => {
      if (_token) {
        const isToken = isTokenValid(_token);
        if (isToken) navigate('login');
      }
    }, []);
  
  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <Login />

      <p className="mt-10 text-center text-sm/6 text-gray-500">
        Not a member ?{' '}
        <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Register Here
        </a>
      </p>
    </div>
  )
}

export default LoginPage