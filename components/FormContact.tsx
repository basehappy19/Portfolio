'use client';
import { Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FormContact = () => {
    const locale = useLocale();
    const isThai = locale === 'th';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error('Failed to send');
            }
            toast.success(isThai ? 'ข้อความถูกส่งแล้ว!' : 'Message sent!');

            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            toast.success(
                isThai
                    ? 'ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง'
                    : 'Failed to send message, please try again.'
            );
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div
            className="
                rounded-2xl p-8
                bg-white border border-gray-200 shadow-sm
                dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-md
            "
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {isThai ? 'ส่งข้อความถึงผม' : 'Send Me A Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ชื่อของคุณ' : 'Your Name'}
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="
                            w-full px-4 py-3 rounded-xl transition-all
                            bg-white border border-gray-300
                            text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent

                            dark:bg-white/10 dark:border-white/20
                            dark:text-white dark:placeholder-white/40
                        "
                        placeholder={isThai ? 'ใส่ชื่อของคุณ' : 'Enter Your Name'}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'อีเมล' : 'Email'}
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="
                            w-full px-4 py-3 rounded-xl transition-all
                            bg-white border border-gray-300
                            text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent

                            dark:bg-white/10 dark:border-white/20
                            dark:text-white dark:placeholder-white/40
                        "
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ข้อความ' : 'Message'}
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="
                            w-full px-4 py-3 rounded-xl transition-all resize-none
                            bg-white border border-gray-300
                            text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent

                            dark:bg-white/10 dark:border-white/20
                            dark:text-white dark:placeholder-white/40
                        "
                        placeholder={
                            isThai
                                ? 'เขียนข้อความของคุณที่นี่'
                                : 'Write Your Message Here'
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="
                        cursor-pointer w-full py-4 rounded-xl font-semibold
                        flex items-center justify-center gap-2 group
                        bg-red-500 text-white
                        hover:shadow-2xl hover:shadow-red-500/50
                        transition-all duration-300
                    "
                >
                    <span>{isThai ? 'ส่งข้อความ' : 'Send Message'}</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default FormContact;
