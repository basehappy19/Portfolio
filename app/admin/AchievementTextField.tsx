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
    /** ขนาดของ input: ใช้ 'lg' สำหรับช่องใหญ่ (ไทย), 'md' สำหรับช่องปกติ (EN) */
    size?: 'md' | 'lg';
    /** ถ้าอยาก override class ของ container */
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
        'w-full',
        'border',
        'bg-white text-gray-900 placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
        'shadow-sm',
        'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
    ].join(' ');

    const sizeClass =
        size === 'lg'
            ? 'px-4 py-3 rounded-xl transition-all duration-200'
            : 'px-3 py-2 rounded-lg';

    const borderClass = hasError
        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400';

    const translatingClass =
        isTranslating && !hasError
            ? 'animate-pulse border-red-400 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]'
            : '';

    const paddingRightClass = onTranslate ? 'pr-28' : '';

    return (
        <div className={`${hasError ? 'error-field' : ''} ${containerClassName}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        className={`
                            cursor-pointer
                            absolute right-2
                            inline-flex items-center justify-center
                            px-3 py-1.5
                            text-xs font-medium
                            rounded-lg
                            border border-sky-500/70
                            bg-sky-50 text-sky-700
                            hover:bg-sky-100 hover:border-sky-600
                            dark:bg-sky-900/20 dark:text-sky-200 dark:border-sky-500/60
                            dark:hover:bg-sky-900/40
                            disabled:opacity-60 disabled:cursor-not-allowed
                            transition-all
                            active:scale-[0.97]
                        `}
                    >
                        {isTranslating ? (
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                                กำลังแปล...
                            </span>
                        ) : (
                            <span>แปลเป็นอังกฤษ</span>
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
