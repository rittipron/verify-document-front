import { useForm } from 'react-hook-form';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SweetAlert } from '@utils/SweetAlert';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  password: string;
  passportOrId: string;
  email: string;
  phoneNumber: string;
  address: string;
  agreed: boolean;
  account: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const email = data.email;
      const username = email.split('@')[0];

      // เรียก API Register
      await axios.post('http://localhost:8080/auth/register', {
        "first_name": data.firstName,
        "last_name": data.lastName,
        "username": username,
        "email": data.email,
        "password": data.password,
        "address": data.address,
        "phone": data.phoneNumber,
        "passport": data.passportOrId,
        "account": data.account
      })

      SweetAlert({
        title: "Registration Successful!",
        message: `Your account has been created successfully. You can now log in`,
        type: "success"
      }).then(async () => {
        const response = await axios.post('http://localhost:8080/auth/login', {
          username: data.email,
          password: data.password ?? "",
        });

        const { token, user } = response.data;
          localStorage.setItem("token", token)
          dispatch(loginSuccess({ token, user }));
          navigate('/dashboard');
      });
      
    } catch (error: any) {
      SweetAlert({
        title: "Error!",
        message: `Register failed: ${error}`,
        type: "error"
      })
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl sm:mt-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
              Password
            </label>
            <div className="mt-2.5">
              <input
                {...register('password', { required: 'Password is required' })}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <input
                {...register('firstName', { required: 'First name is required' })}
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                {...register('lastName', { required: 'Last name is required' })}
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="passportOrId" className="block text-sm font-semibold text-gray-900">
              Passport OR ID CARD
            </label>
            <div className="mt-2.5">
              <input
                {...register('passportOrId', { required: 'Passport or ID card is required' })}
                id="passportOrId"
                name="passportOrId"
                type="text"
                autoComplete="organization"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.passportOrId && <p className="text-red-500 text-xs">{errors.passportOrId.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-900">
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option>TH</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
                <input
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                  id="phone-number"
                  name="phoneNumber"
                  type="text"
                  placeholder="123-456-7890"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
              Account Bank
            </label>
            <div className="mt-2.5">
              <input
                {...register('account', { required: 'Account Bank is required' })}
                id="account"
                name="account"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
              {errors.account && <p className="text-red-500 text-xs">{errors.account.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-900">
              Address
            </label>
            <div className="mt-2.5">
              <textarea
                {...register('address')}
                id="address"
                name="address"
                rows={4}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                defaultValue={''}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
