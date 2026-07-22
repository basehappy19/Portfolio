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
}) => {
    const hasError = Boolean(error && touched);

    const baseInputClass = [
        'w-full rounded-lg border transition-all duration-150',
        'bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500',
        'shadow-2xs',
        'dark:bg-zinc-800/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-rose-500',
    ].join(' ');

    const sizeClass =
        size === 'lg'
            ? 'px-4 py-3 text-base sm:text-lg font-semibold rounded-xl'
            : 'px-3.5 py-2.5 text-sm sm:text-base font-medium rounded-lg';

    const borderClass = hasError
        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
        : 'border-gray-200 dark:border-zinc-700';

    return (
        <div className={`${hasError ? 'error-field' : ''} ${containerClassName}`}>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                {label}{' '}
                {required && <span className="text-rose-500">*</span>}
            </label>

            <div className="relative flex items-center">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`${baseInputClass} ${sizeClass} ${borderClass}`}
                />
            </div>

            {hasError && (
                <div className="flex items-center gap-1.5 mt-1 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};