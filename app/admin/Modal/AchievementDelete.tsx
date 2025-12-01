'use client';

type DeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    isLoading?: boolean;
    isAnimating: boolean
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
        <div onClick={onClose}
            style={{
                animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
            }} className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()}
                style={{
                    animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                }} className="bg-white dark:bg-[#282c33] rounded-lg shadow-xl max-w-sm w-full p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ยืนยันการลบ
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    คุณแน่ใจหรือไม่ว่าต้องการลบ
                    {itemName ? ` “${itemName}”` : 'รายการนี้'}?
                    <br />
                    การลบนี้ไม่สามารถย้อนกลับได้
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-60"
                    >
                        {isLoading ? 'กำลังลบ...' : 'ลบ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
