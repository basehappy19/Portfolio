'use client';

import React, { ChangeEvent } from 'react';
import { AlertCircle } from 'lucide-react';

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    touched?: boolean;
    size?: 'md' | 'lg';
    containerClassName?: string;
    isTranslating?: boolean;
    onTranslate?: () => void;
};

export const AchievementTextField: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    error,
    touched,
    size = 'md',
    containerClassName = '',
    isTranslating = false,
    onTranslate,
}) => {
    const hasError = Boolean(error && touched);

    const baseInputClass = [
        'w-full rounded-xl border-2 transition-all duration-200',
        'bg-white text-gray-900 placeholder-gray-400 hover:border-red-300 hover:bg-white',
        'dark:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500',
        'shadow-sm',
        'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-red-500',
    ].join(' ');

    const sizeClass =
        size === 'lg'
            ? 'px-4 py-3.5' // ปรับ padding ให้สมดุล
            : 'px-3 py-2.5';

    const borderClass = hasError
        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400';

    const translatingClass =
        isTranslating && !hasError
            ? 'animate-pulse border-red-400 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]'
            : '';

    // ลด padding ขวาลงเพื่อให้พอดีกับปุ่ม Icon (เดิม pr-28 กว้างไป)
    const paddingRightClass = onTranslate ? 'pr-12' : '';

    return (
        <div className={`${hasError ? 'error-field' : ''} ${containerClassName}`}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {label}{' '}
                {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative flex items-center">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`${baseInputClass} ${sizeClass} ${borderClass} ${translatingClass} ${paddingRightClass}`}
                />

                {onTranslate && (
                    <button
                        type="button"
                        onClick={onTranslate}
                        disabled={isTranslating}
                        // แก้ไขตำแหน่ง: ใช้ top-1/2 -translate-y-1/2 เพื่อจัดกึ่งกลางแนวตั้ง
                        className="
                            cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-10 
                            p-1.5 rounded-md 
                            bg-white/80 dark:bg-gray-800/80 
                            hover:bg-sky-50 text-sky-600 
                            border border-gray-200 shadow-sm backdrop-blur-sm 
                            transition-all
                            disabled:opacity-50
                        "
                        title="Translate to English"
                    >
                        {isTranslating ? (
                            <span className="w-4 h-4 block rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
                        )}
                    </button>
                )}
            </div>

            {hasError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-slideDown">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {!hasError && isTranslating && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>AI กำลังแปล...</span>
                </div>
            )}
        </div>
    );
};