'use client';

type DeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    isLoading?: boolean;
    isAnimating: boolean;
};

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isLoading = false,
    isAnimating = false
}: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
            }}
            className="
                fixed inset-0 z-50 flex items-center justify-center cursor-pointer
                backdrop-blur-sm
                bg-black/40 dark:bg-black/60
            "
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: isAnimating
                        ? 'modalSlideIn 0.3s ease-out'
                        : 'modalSlideOut 0.2s ease-in'
                }}
                className="
                    max-w-sm w-full rounded-lg p-6 shadow-xl
                    bg-white border border-gray-200
                    dark:bg-[#282c33] dark:border-gray-700
                "
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ยืนยันการลบ
                </h2>

                <p
                    className="
        text-sm text-gray-600 dark:text-gray-300 mb-6
        wrap-break-word overflow-hidden line-clamp-2
    "
                >
                    คุณแน่ใจหรือไม่ว่าต้องการลบ
                    {itemName ? (
                        <span className="font-semibold wrap-break-word">
                            {` “${itemName}”`}
                        </span>
                    ) : (
                        "รายการนี้"
                    )}
                    ?<br />
                    การลบนี้ไม่สามารถย้อนกลับได้
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="
                            cursor-pointer px-4 py-2 rounded-lg text-sm transition-all
                            bg-white text-gray-700 border border-gray-300 hover:bg-gray-100
                            disabled:opacity-60

                            dark:bg-transparent dark:text-gray-200 dark:border-gray-600
                            dark:hover:bg-gray-700
                        "
                    >
                        ยกเลิก
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="
                            cursor-pointer px-4 py-2 rounded-lg text-sm
                            bg-red-600 hover:bg-red-700 text-white
                            disabled:opacity-60 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-red-500/60
                        "
                    >
                        {isLoading ? 'กำลังลบ...' : 'ลบ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
