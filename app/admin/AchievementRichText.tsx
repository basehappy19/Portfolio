'use client';

// 1. เพิ่ม useState
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
    isTranslating?: boolean;
    onTranslate?: () => void;
};

export function AchievementRichText({
    label,
    name,
    value,
    onChange,
    placeholder,
    errorMessage,
    isTranslating = false,
    onTranslate,
}: Props) {
    const hasError = Boolean(errorMessage);

    // 2. สร้างตัวแปร State หลอกๆ เพื่อใช้บังคับให้ Component อัปเดต
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({}),
            TextStyle,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-sky-600 underline underline-offset-2',
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
                    'min-h-[140px] w-full rounded-xl border-2 px-4 py-3.5 resize-y overflow-auto',
                    'bg-white text-gray-900 shadow-sm',
                    'placeholder:text-gray-400',
                    'focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500',
                    'dark:bg-gray-800 dark:text-white dark:border-gray-700',
                    'prose prose-sm sm:prose-base dark:prose-invert max-w-none',
                    '[&_ul]:list-disc [&_ul]:pl-5',
                    '[&_ol]:list-decimal [&_ol]:pl-5',
                    '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2',
                    '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1',
                    '[&_p]:mb-2',
                    '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:text-gray-400 [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:pointer-events-none',
                    hasError ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-200',
                ].join(' '),
            },
        },
        // 3. เมื่อเนื้อหาเปลี่ยน (พิมพ์)
        onUpdate({ editor }) {
            onChange(name, editor.getHTML());
        },
        // 4. เพิ่ม: เมื่อมีการเลือกข้อความ หรือขยับ Cursor ให้บังคับ Render ใหม่ทันที
        onSelectionUpdate() {
            forceUpdate((prev) => prev + 1);
        },
        // 5. เพิ่ม: เมื่อมีการเปลี่ยนแปลงใดๆ (เช่น Focus) ให้บังคับ Render ใหม่ทันที
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

    const btnBase = 'px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-[0.97] whitespace-nowrap';
    const btn = 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800';

    const isActive = (type: string, opts?: Record<string, unknown>) =>
        editor?.isActive(type, opts) ? 'ring-2 ring-red-500/30 bg-red-50 dark:bg-red-900/10' : '';

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {label}
            </label>

            <div className="relative">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    {/* Bold (Ctrl+B) */}
                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('bold')}`}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        disabled={!editor}
                        title="Bold (Ctrl+B)"
                    >
                        <b>B</b>
                    </button>

                    {/* Italic (Ctrl+I) */}
                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('italic')}`}
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        disabled={!editor}
                        title="Italic (Ctrl+I)"
                    >
                        <i>I</i>
                    </button>

                    {/* Underline (Ctrl+U) */}
                    <button
                        type="button"
                        className={`${btnBase} ${btn} ${isActive('underline')}`}
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        disabled={!editor}
                        title="Underline (Ctrl+U)"
                    >
                        <u>U</u>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>

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
                        className={`${btnBase} ${btn} text-red-500 ml-auto`}
                        onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                        disabled={!editor}
                    >
                        Clear
                    </button>
                </div>

                <EditorContent editor={editor} />

                {onTranslate && (
                    <button
                        type="button"
                        onClick={onTranslate}
                        disabled={isTranslating}
                        className="cursor-pointer absolute right-2 top-14 z-10 p-1.5 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-sky-50 text-sky-600 border border-gray-200 shadow-sm backdrop-blur-sm transition-all"
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
            {hasError && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
        </div>
    );
}