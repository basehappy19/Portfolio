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
}) => {
    const hasError = Boolean(error && touched);

    const baseInputClass =
        'w-full px-4 border focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white';

    const sizeClass =
        size === 'lg'
            ? 'py-3 rounded-xl focus:border-transparent transition-all duration-200'
            : 'py-2 rounded-lg';

    const borderClass = hasError
        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400';

    const translatingClass = isTranslating && !hasError
        ? 'animate-pulse border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]'
        : '';

    return (
        <div className={`${hasError ? 'error-field' : ''} ${containerClassName}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}{' '}
                {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`${baseInputClass} ${sizeClass} ${borderClass} ${translatingClass}`}
            />

            {hasError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-slideDown">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {!hasError && isTranslating && (
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span>AI กำลังแปล...</span>
                </div>
            )}
        </div>
    );
};
