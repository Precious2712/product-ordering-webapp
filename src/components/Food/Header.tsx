'use client'

import { useAppContext } from '@/useContext/context';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Header = () => {
    const [name, setName] = useState<string>('');
    const [scrollY, setScrollY] = useState(0);
    const [box, setBox] = useState(false);

    const { cartItem, modal } = useAppContext();

    const navigate = useRouter();

    console.log('name---', name);
    
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        console.log(storedName);
        
        setName(storedName ?? '');

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Name');
        localStorage.removeItem('userId');
        localStorage.removeItem('payment_reference')
        navigate.push('/');
    };

    function AminLogout() {
        localStorage.removeItem('adminToken');
        navigate.push('/admin-login');
    }

    function handlerShow() {
        setBox(!box);
    }


    return (
        <header
            className={`
                fixed top-0 z-40 w-full flex justify-between items-center px-6 py-4
                transition-colors duration-500 ease-in-out
                ${scrollY > 50
                    ? 'bg-white text-black shadow-md'
                    : 'bg-transparent text-white'}
            `}
        >
            <span className="font-semibold">{name}</span>
            <div className='flex gap-3 items-center'>
                <div onClick={handlerShow} className='relative cursor-pointer'>
                    <EllipsisVertical />

                    {box && (
                        <div className='absolute bg-white text-black font-mono rounded-sm flex flex-col gap-1 text-xs py-2 px-3 w-30 mt-2 cursor-pointer'>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/cars'>
                                Cars
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/items'>
                                Items
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='luxuries'>
                                Luxury
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/admin-dashboard'>
                                Dashboard
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/login'>
                                Login
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/create-admin'>
                                Create Admin
                            </Link>
                            <Link className='py-1 px-1 rounded-md hover:bg-gray-600 hover:text-white' href='/login-admin'>
                                Login Admin
                            </Link>
                            <span onClick={AminLogout}>Admin Logout</span>
                        </div>
                    )}
                </div>

                <div onClick={modal} className="relative inline-flex cursor-pointer">
                    <ShoppingCart className="w-6 h-6" />

                    {cartItem?.length && (
                        <span
                            className="
                absolute -top-2 -right-2
                flex items-center justify-center
                min-w-4.5 h-4-5
                rounded-full
                bg-red-500 text-white
                text-[11px] font-semibold
            "
                        >
                            {cartItem.length}
                        </span>
                    )}
                </div>

                <button onClick={handleLogout} className='bg-red-900 py-0.5 px-2 border rounded-xl cursor-pointer'>Logout</button>
            </div>

        </header>
    );
};