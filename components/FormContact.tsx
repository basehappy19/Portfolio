'use client';
import { Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';

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

            console.log('Form submitted:', formData);
            alert(isThai ? 'ข้อความถูกส่งแล้ว!' : 'Message sent!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            alert(isThai ? 'ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง' : 'Failed to send message, please try again.');
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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                {isThai ? 'ส่งข้อความถึงผม' : 'Send Me A Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        {isThai ? 'ชื่อของคุณ' : 'Your Name'}
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder={isThai ? 'ใส่ชื่อของคุณ' : 'Enter Your Name'}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        {isThai ? 'อีเมล' : 'Email'}
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        {isThai ? 'ข้อความ' : 'Message'}
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder={isThai ? 'เขียนข้อความของคุณที่นี่' : 'Write Your Message Here'}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                >
                    <span>{isThai ? 'ส่งข้อความ' : 'Send Message'}</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default FormContact;
