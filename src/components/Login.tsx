import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '@redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SweetAlert } from '@utils/SweetAlert';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: data.username,
        password: data.password ?? "",
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token)
      dispatch(loginSuccess({ token, user }));
      SweetAlert({
        title: "Login Successful!",
        message: `Your account has been log in successfully`,
        type: "success"
      }).then(async () => {
          navigate('/');
      });
    } catch (error: any) {
      SweetAlert({
        title: "Error!",
        message: error,
        type: "error"
      })
      setShowError(true)
      setMessage(error)
      dispatch(loginFailure('Invalid username or password'));
    }
  };

  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
