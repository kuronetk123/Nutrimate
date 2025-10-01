'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import UnauthorizedPage from '@/components/common/UnauthorizedPage';
import { CreditCardIcon } from '@heroicons/react/24/outline';
export default function ProfileInfo() {

    const { data: session, update } = useSession();
    const subscriptionMap = {
        free: 'Miễn phí',
        basic: 'Cơ bản',
        'premium-monthly': 'Cao cấp (tháng)'
    };

    const status = session?.user?.subscription?.status;
    const displayStatus = subscriptionMap[status] || 'Chưa đăng ký gói nào';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        weight: '',
        height: '',
        gender: '',
        age: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                console.log('Session:', session);
                setFormData({
                    name: session.user.name || '',
                    image: session.user.image || '',
                    email: session.user.email || '',
                    weight: session.user.profile.weight || '',
                    height: session.user.profile.height || '',
                    gender: session.user.profile.gender || '',
                    age: session.user.profile.age || '',
                });

            }
        };
        fetchData();
    }, [session]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData }),
            });
            if (res.ok) {
                toast.success('Profile updated successfully');
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        profile: { ...session.user.profile, ...formData },
                    },
                });

            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (!session) {
        return (
            <UnauthorizedPage />
        );
    }

    return (
        <form onSubmit={handleSubmit}>

            {/* Profile section */}
            <div className="px-4 py-6 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg/6 font-medium text-gray-900">Hồ sơ cá nhân</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Thông tin này sẽ được đảm bảo riêng tư và chỉ được sử dụng để cá nhân hóa trải nghiệm của bạn.
                    </p>
                </div>

                <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="grow space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        Nutrimate-nu.vercel.app/
                                    </div>
                                    <input
                                        defaultValue={formData.name.trim().toLowerCase().replace(/\s+/g, '')}
                                        id="username"
                                        name="username"
                                        type="text"
                                        disabled={true}
                                        placeholder="janesmith"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Tên đầy đủ
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">

                                    <input
                                        value={formData.name}
                                        id="username"
                                        disabled={true}
                                        name="username"
                                        type="text"
                                        placeholder="janesmith"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">

                                    <input
                                        value={formData.email}
                                        id="email"
                                        disabled={true}
                                        name="email"
                                        type="text"

                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 grow lg:mt-0 lg:ml-6 lg:shrink-0 lg:grow-0">
                        <p aria-hidden="true" className="text-sm/6 font-medium text-gray-900">
                            Photo
                        </p>
                        <div className="mt-2 lg:hidden">
                            <div className="flex items-center">
                                <div
                                    aria-hidden="true"
                                    className="inline-block size-12 shrink-0 overflow-hidden rounded-full"
                                >
                                    <img alt=""

                                        src={formData.image}

                                        className="size-full rounded-full" />
                                </div>
                                <div className="relative ml-5">
                                    <input
                                        id="mobile-user-photo"
                                        name="user-photo"
                                        src={formData.image}
                                        type="file"
                                        className="peer absolute size-full rounded-md opacity-0"
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                            <img
                                alt="User"
                                src={formData.image}
                                className="relative size-40 rounded-full object-cover"
                            />

                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                            Chiều cao (cm)
                        </label>
                        <div className="mt-2">
                            <input
                                id="height"
                                type="number"
                                value={formData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                            Cân nặng (kg)
                        </label>
                        <div className="mt-2">
                            <input
                                id="weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>


                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="age" className="block text-sm/6 font-medium text-gray-900">
                            Tuổi
                        </label>
                        <div className="mt-2">
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>


                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="age" className=" text-sm/6 font-medium text-gray-900 flex items-center gap-x-2">
                            <CreditCardIcon className='h-6 w-6' />    Gói đăng ký
                        </label>
                        <div className="mt-2">
                            <input
                                value={displayStatus}
                                disabled
                                className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy section */}
            <div className="divide-y divide-gray-200 pt-6">

                <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </form>
    )
}
