'use client';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

type FormState = {
    name: string;
    email: string;
    message: string;
};

type ValidationErrors = Partial<Record<keyof FormState, string>>;

type TouchedState = {
    name: boolean;
    email: boolean;
    message: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FormContact = () => {
    const locale = useLocale();
    const isThai = locale === 'th';
    const router = useRouter();

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedState>({
        name: false,
        email: false,
        message: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        message: '',
    });

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target;
        const name = target.name as keyof FormState;

        let value: string | number | boolean = target.value;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            value = target.checked;
        }

        if (target instanceof HTMLInputElement && target.type === 'number') {
            value = Number(target.value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: value as string,
        }));

        setErrors(prev => {
            if (!(name in prev)) return prev;
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleBlur = (fieldName: keyof TouchedState) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    const validateForm = () => {
        const newErrors: ValidationErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = isThai
                ? 'กรุณากรอกชื่อผู้ส่ง'
                : "Please enter the sender's name";
        }

        if (!formData.email.trim()) {
            newErrors.email = isThai
                ? 'กรุณากรอกอีเมล'
                : 'Please enter email';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = isThai
                ? 'รูปแบบอีเมลไม่ถูกต้อง'
                : 'Invalid email format';
        }

        if (!formData.message.trim()) {
            newErrors.message = isThai
                ? 'กรุณากรอกข้อความ'
                : 'Please enter message';
        }

        setTouched({
            name: true,
            email: true,
            message: true,
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateForm()) {
            toast.error(
                isThai
                    ? 'กรุณากรอกข้อมูลให้ครบถ้วน'
                    : 'Please fill out the information completely.'
            );

            const firstError = document.querySelector('.error-field');
            firstError?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });

            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to send');
            }

            toast.success(
                isThai ? 'ข้อความถูกส่งแล้ว!' : 'Message sent!'
            );

            setFormData({ name: '', email: '', message: '' });
            setErrors({});
            setTouched({ name: false, email: false, message: false });

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(
                isThai
                    ? 'ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง'
                    : 'Failed to send message, please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.name.trim() !== '' &&
        formData.email.trim() !== '' &&
        emailRegex.test(formData.email) &&
        formData.message.trim() !== '';

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

            <form className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ชื่อของคุณ' : 'Your Name'}{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('name')}
                        className={`
                            w-full px-4 py-3 rounded-xl transition-all
                            border text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                            dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/40
                            ${
                                errors.name && touched.name
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 error-field'
                                    : 'bg-white border-gray-300'
                            }
                        `}
                        placeholder={
                            isThai ? 'ใส่ชื่อของคุณ' : 'Enter Your Name'
                        }
                    />
                    {errors.name && touched.name && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.name}</span>
                        </div>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'อีเมล' : 'Email'}{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        className={`
                            w-full px-4 py-3 rounded-xl transition-all
                            border text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                            dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/40
                            ${
                                errors.email && touched.email
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 error-field'
                                    : 'bg-white border-gray-300'
                            }
                        `}
                        placeholder="your.email@example.com"
                    />
                    {errors.email && touched.email && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ข้อความ' : 'Message'}{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('message')}
                        rows={5}
                        className={`
                            w-full px-4 py-3 rounded-xl transition-all resize-none
                            border text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                            dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/40
                            ${
                                errors.message && touched.message
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 error-field'
                                    : 'bg-white border-gray-300'
                            }
                        `}
                        placeholder={
                            isThai
                                ? 'เขียนข้อความของคุณที่นี่'
                                : 'Write Your Message Here'
                        }
                    />
                    {errors.message && touched.message && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.message}</span>
                        </div>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid}
                    className="
                        cursor-pointer w-full py-4 rounded-xl font-semibold
                        flex items-center justify-center gap-2 group
                        bg-red-500 text-white
                        hover:shadow-2xl hover:shadow-red-500/50
                        transition-all duration-300
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
                        relative overflow-hidden
                    "
                >
                    {isSubmitting && (
                        <div
                            className="absolute inset-0 bg-linear-to-r from-red-600 via-red-400 to-red-600"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                            }}
                        />
                    )}

                    <div className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="relative">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-white/30 animate-ping" />
                                </div>
                                <span className="animate-pulse">
                                    {isThai ? 'กำลังส่ง...' : 'Sending...'}
                                </span>
                                <div className="flex gap-1">
                                    <div
                                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                        style={{ animationDelay: '0ms' }}
                                    />
                                    <div
                                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                        style={{ animationDelay: '150ms' }}
                                    />
                                    <div
                                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                        style={{ animationDelay: '300ms' }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <span>
                                    {isThai ? 'ส่งข้อความ' : 'Send Message'}
                                </span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </form>
        </div>
    );
};

export default FormContact;
