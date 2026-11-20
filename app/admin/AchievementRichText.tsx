'use client';

import { useEffect, useState } from 'react';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    errorMessage?: string;
};

export function AchievementRichText({
    label,
    name,
    value,
    onChange,
    placeholder,
    errorMessage,
}: Props) {
    const hasError = Boolean(errorMessage);
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ link: false, underline: false }),
            TextStyle,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-rose-600 underline underline-offset-2',
                    rel: 'noopener noreferrer nofollow',
                    target: '_blank',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Type something...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: [
                    'min-h-[180px] w-full rounded-xl border px-4 py-3.5 resize-y overflow-auto text-sm sm:text-base leading-relaxed',
                    'bg-white text-gray-900 shadow-2xs',
                    'placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500',
                    'dark:bg-zinc-800/80 dark:text-white dark:border-zinc-700 dark:focus:border-rose-500',
                    'prose prose-sm sm:prose-base dark:prose-invert max-w-none',
                    '[&_ul]:list-disc [&_ul]:pl-5',
                    '[&_ol]:list-decimal [&_ol]:pl-5',
                    '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1',
                    '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1',
                    '[&_p]:mb-2',
                    hasError ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-zinc-700',
                ].join(' '),
            },
        },
        onUpdate({ editor }) {
            onChange(name, editor.getHTML());
        },
        onSelectionUpdate() {
            forceUpdate((prev) => prev + 1);
        },
        onTransaction() {
            forceUpdate((prev) => prev + 1);
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value && value !== current) {
            if (editor.getText() === '' && value === '<p></p>') return;
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    const setLink = () => {
        if (!editor) return;
        const prevUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', prevUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const btnBase = 'px-2.5 py-1 text-xs font-medium rounded border transition active:scale-[0.97] whitespace-nowrap cursor-pointer';
    const btn = 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700';

    const isActive = (type: string, opts?: Record<string, unknown>) =>
        editor?.isActive(type, opts) ? 'ring-1 ring-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : '';

    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                {label}
            </label>

            <div className="relative">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('bold')}`}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        disabled={!editor}
                        title="Bold (Ctrl+B)"
                    >
                        <b>B</b>
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('italic')}`}
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        disabled={!editor}
                        title="Italic (Ctrl+I)"
                    >
                        <i>I</i>
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('underline')}`}
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        disabled={!editor}
                        title="Underline (Ctrl+U)"
                    >
                        <u>U</u>
                    </button>

                    <div className="w-px h-5 bg-gray-200 dark:bg-zinc-700 mx-0.5"></div>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('heading', { level: 2 })}`}
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        disabled={!editor}
                    >
                        H2
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('heading', { level: 3 })}`}
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        disabled={!editor}
                    >
                        H3
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('bulletList')}`}
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        disabled={!editor}
                    >
                        List
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('link')}`}
                        onClick={setLink}
                        disabled={!editor}
                    >
                        Link
                    </button>

                    <button
                        type="button"
                        className={`${btnBase} ${btn} text-red-500 hover:text-red-600 ml-auto`}
                        onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                        disabled={!editor}
                    >
                        Clear
                    </button>
                </div>

                <EditorContent editor={editor} />
            </div>
            {hasError && <div className="mt-1 text-xs text-red-600 dark:text-red-400">{errorMessage}</div>}
        </div>
    );
}