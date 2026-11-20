'use client';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { saveMessage } from '@/app/actions/message';

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
            const res = await saveMessage(formData);

            if (!res.success) {
                throw new Error('Failed to send');
            }

            toast.success(
                isThai ? 'ข้อความถูกส่งแล้ว!' : 'Message sent!'
            );

            setFormData({ name: '', email: '', message: '' });
            setErrors({});
            setTouched({ name: false, email: false, message: false });

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

    const field = (name: keyof FormState) =>
        `w-full rounded-2xl border bg-white/5 px-4 text-white placeholder-zinc-500 transition-all duration-300 focus:border-rose-300 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-rose-400/20 ${
            errors[name] && touched[name] ? "error-field border-rose-400" : "border-white/15"
        }`;

    const errorText = (name: keyof FormState) =>
        errors[name] && touched[name] ? (
            <p id={`${name}-error`} className="mt-2 flex items-center gap-2 text-sm text-rose-300">
                <AlertCircle aria-hidden="true" size={16} />
                {errors[name]}
            </p>
        ) : null;

    return (
        <div className="glass-dark rounded-[32px] p-6 sm:p-9">
            <h3 className="text-2xl font-bold text-white">{isThai ? 'ส่งข้อความถึงผม' : 'Send me a message'}</h3>

            <form
                className="mt-7 space-y-5"
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-zinc-300">
                        {isThai ? 'ชื่อของคุณ' : 'Your name'} <span className="text-rose-300">*</span>
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('name')}
                        aria-invalid={!!(errors.name && touched.name)}
                        aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                        className={`${field('name')} min-h-13`}
                        placeholder={isThai ? 'ใส่ชื่อของคุณ' : 'Enter your name'}
                    />
                    {errorText("name")}
                </div>

                <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-zinc-300">
                        {isThai ? 'อีเมล' : 'Email'} <span className="text-rose-300">*</span>
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        aria-invalid={!!(errors.email && touched.email)}
                        aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                        className={`${field('email')} min-h-13`}
                        placeholder="your.email@example.com"
                    />
                    {errorText("email")}
                </div>

                <div>
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-zinc-300">
                        {isThai ? 'ข้อความ' : 'Message'} <span className="text-rose-300">*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('message')}
                        aria-invalid={!!(errors.message && touched.message)}
                        aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
                        className={`${field('message')} resize-none py-3`}
                        placeholder={isThai ? 'เขียนข้อความของคุณที่นี่' : 'Write your message here'}
                    />
                    {errorText("message")}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="group relative inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white font-bold text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(255,255,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                            {isThai ? 'กำลังส่ง…' : 'Sending…'}
                        </>
                    ) : (
                        <>
                            {isThai ? 'ส่งข้อความ' : 'Send message'}
                            <Send aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FormContact;
