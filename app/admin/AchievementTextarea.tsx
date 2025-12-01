'use client';

import React, { ChangeEvent } from 'react';

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    rows?: number;
    isTranslating?: boolean;
    errorMessage?: string;
};

export const AchievementTextarea: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    rows = 4,
    isTranslating = false,
    errorMessage,
}) => {
    const hasError = Boolean(errorMessage);

    const baseClass =
        'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white resize-none transition-all';

    const borderClass = hasError
        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-200 dark:border-gray-700';

    const translatingClass =
        isTranslating && !hasError
            ? 'border-blue-400 animate-pulse'
            : '';

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                placeholder={placeholder}
                className={`${baseClass} ${borderClass} ${translatingClass}`}
            />

            {hasError && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                </div>
            )}

            {isTranslating && !hasError && (
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span>AI กำลังแปล...</span>
                </div>
            )}
        </div>
    );
};
