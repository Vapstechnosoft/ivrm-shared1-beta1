'use client';
import { Facebook, Globe, Linkedin, Mail, Phone, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='w-full border-gray-200 border-t bg-white py-4'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
                    <div className='text-center text-gray-600 text-sm sm:text-left'>
                        <span className='font-medium'>© VAPS {currentYear}</span>
                        <span className='mx-1'>.</span>
                        <span>All rights reserved.</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm'>
                        <span className='text-gray-400'>|</span>
                        <span className='font-semibold text-gray-800'>VAPS DIGITAL CAMPUS</span>
                        <div className='ml-2 flex items-center gap-2'>
                            <Phone className='h-4 w-4 text-gray-600' />
                            <Mail className='h-4 w-4 text-gray-600' />
                            <Globe className='h-4 w-4 text-gray-600' />
                        </div>
                        <div className='ml-2 flex items-center gap-2 text-center text-sm sm:text-right'>
                            <span className='text-gray-400'>|</span>
                            <span className='text-gray-600'>Toll Free No.</span>
                            <span className='ml-2 font-semibold text-gray-800'>01206901388</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <a
                                href='https://facebook.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full p-1.5 text-blue-600 transition-colors hover:bg-blue-50'
                                aria-label='Facebook'>
                                <Facebook className='h-4 w-4' />
                            </a>
                            <a
                                href='https://twitter.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full p-1.5 text-blue-400 transition-colors hover:bg-blue-50'
                                aria-label='Twitter'>
                                <Twitter className='h-4 w-4' />
                            </a>
                            <a
                                href='https://youtube.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full p-1.5 text-red-600 transition-colors hover:bg-red-50'
                                aria-label='YouTube'>
                                <Youtube className='h-4 w-4' />
                            </a>
                            <a
                                href='https://linkedin.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full p-1.5 text-blue-700 transition-colors hover:bg-blue-50'
                                aria-label='LinkedIn'>
                                <Linkedin className='h-4 w-4' />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
