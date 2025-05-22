import { useEffect, useState } from 'react';
import axios from 'axios';
import { SweetAlert } from '@utils/SweetAlert';
import { useSelector } from 'react-redux';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { decodeJWT } from '@/utils/JwtToken';

const Home: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: any) => state.auth.token);
    const [data, setData] = useState<any>(null);

    let _token = token || localStorage?.getItem("token");

    const verifyDoc = async () => {
        try {
            console.log(data.document_id)
            const userId = decodeJWT();
            await axios.post('http://localhost:8080/api/verifyData', { userId: userId, document_id: data?.document_id }, {
                headers: {
                    'Authorization': `Bearer ${_token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                SweetAlert({
                    title: "Success!",
                    message: "Your data has been verify successfully.",
                    type: "success"
                  }).then((res) => {
                    fnCheckActiveVerify(userId);
                  })
            }).catch(e => {
                SweetAlert({
                    title: "Error!",
                    message: `Register failed: ${e}`,
                    type: "error"
                });
            });
            
        } catch (error: any) {
            SweetAlert({
                title: "Error!",
                message: `Register failed: ${error}`,
                type: "error"
            });
        }
    }

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
                <h3 className="text-base/7 font-semibold text-gray-900 mt-4">Information</h3>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details in application.</p>
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
                                            <a
                                                href={data?.document_url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate font-medium text-indigo-600"
                                            >
                                                {data?.document_name || "Admin"}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="ml-4 shrink-0">
                                        <a
                                            href={data?.document_url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-500"
                                        >
                                            View
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
            { data?.verified == 0 && <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={() => verifyDoc()}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={loading}
                >
                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        <span>Verify</span>
                    )}
                </button>
            </div>}
        </div>
    );
};

export default Home;
