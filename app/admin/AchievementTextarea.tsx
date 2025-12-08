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
    onTranslate?: () => void;
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
    onTranslate,
}) => {
    const hasError = Boolean(errorMessage);

    const baseClass = [
        'w-full px-4 py-3 border rounded-xl resize-none transition-all',
        // light mode
        'bg-white text-gray-900 placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
        // dark mode
        'dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400',
    ].join(' ');

    const borderClass = hasError
        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-200 dark:border-gray-700';

    const translatingClass =
        isTranslating && !hasError
            ? 'border-red-400 animate-pulse'
            : '';

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>

            <div className="relative flex">

                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${baseClass} ${borderClass} ${translatingClass}`}
                />
                {onTranslate && (
                    <button
                        type="button"
                        onClick={onTranslate}
                        disabled={isTranslating}
                        className={`
                            cursor-pointer
                            absolute right-2 top-2
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
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                </div>
            )}

            {isTranslating && !hasError && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>AI กำลังแปล...</span>
                </div>
            )}
        </div>
    );
};
