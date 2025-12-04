'use client';
import { AlertCircle, Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

type FormState = {
    name: string
    email: string,
    message: string,
}

type ValidationErrors = Partial<Record<keyof FormState, string>>;

type TouchedState = {
    name: boolean
    email: boolean,
    message: boolean,
};

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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target;
        const name = target.name as keyof FormState;

        let value: string | number | boolean = target.value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        }

        if (target instanceof HTMLInputElement && target.type === "number") {
            value = Number(target.value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => {
            if (!(name in prev)) return prev;

            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleBlur = (fieldName: keyof TouchedState) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    };


    const validateForm = () => {
        const newErrors: ValidationErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = isThai ? "กรุณากรอกชื่อผู้ส่ง" : "Please enter the sender's name";
        }

        if (!formData.email.trim()) {
            newErrors.email = isThai ? "กรุณากรอกอีเมล" : "Please enter email";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = isThai ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format";
            }
        }

        if (!formData.message.trim()) {
            newErrors.message = isThai ? "กรุณากรอกข้อความ" : "Please enter message";
        }

        setTouched((prev) => ({
            ...prev,
            name: true,
            email: true,
            message: true,
        }));

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error(isThai ? "กรุณากรอกข้อมูลให้ครบถ้วน" : 'Please fill out the information completely.');

            const firstError = document.querySelector('.error-field');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return;
        }

        try {
            const res = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error('Failed to send');
            }
            toast.success(isThai ? 'ข้อความถูกส่งแล้ว!' : 'Message sent!');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.success(
                isThai
                    ? 'ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง'
                    : 'Failed to send message, please try again.'
            );
        }
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

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ชื่อของคุณ' : 'Your Name'} {" "}
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
    ${errors.name && touched.name
                                ? "border-red-400 bg-red-50 dark:bg-red-900/20 error-field"
                                : "bg-white border-gray-300 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/40"}
  `}
                        placeholder={isThai ? 'ใส่ชื่อของคุณ' : 'Enter Your Name'}
                    />
                    {errors.name && touched.name && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.name}</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'อีเมล' : 'Email'} {" "}
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
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white
  ${errors.email && touched.email
                                ? "border-red-400 bg-red-50 dark:bg-red-900/20 error-field"
                                : "bg-white border-gray-300 dark:bg-white/10 dark:border-white/20 dark:placeholder-white/40"}
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

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white/70">
                        {isThai ? 'ข้อความ' : 'Message'} {" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('message')}
                        rows={5}
                        className={`
    w-full px-4 py-3 rounded-xl transition-all
    border text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
    ${errors.message && touched.message
                                ? "border-red-400 bg-red-50 dark:bg-red-900/20 error-field"
                                : "bg-white border-gray-300 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/40"}
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

                <button
                    type="button"
                    onClick={handleSubmit}
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
