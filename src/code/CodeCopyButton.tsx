'use client';

import CheckIcon from '@/icons/CheckIcon';
import CopyIcon from '@/icons/CopyIcon';

export interface CodeCopyButtonProps {
    onCopy: () => void;
    copied: boolean;
}

export default function CodeCopyButton({ onCopy, copied }: CodeCopyButtonProps) {
    return (
        <button
            onClick={onCopy}
            className={`absolute top-2 right-2 z-30
        text-sm bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded
        flex items-center gap-1 cursor-pointer
        transition-all duration-300 ease-in-out
        opacity-100 [@media(hover:hover)]:opacity-0
        group-hover:opacity-100 group-focus-within:opacity-100`}
            aria-label={copied ? 'Copied!' : 'Copy code'}
        >
            <div className="relative w-16 h-5 flex items-center justify-center overflow-hidden">
                <div
                    className={`absolute inset-0 flex items-center justify-center
            transition-transform duration-300 ease-in-out
            ${copied ? '-translate-y-full' : 'translate-y-0'}`}
                >
                    <div className="flex items-center gap-1">
                        <CopyIcon />
                        <span>Copy</span>
                    </div>
                </div>

                <div
                    className={`absolute inset-0 flex items-center justify-center
            transition-transform duration-300 ease-in-out
            ${copied ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    <div className="flex items-center gap-1">
                        <CheckIcon />
                        <span>Copied!</span>
                    </div>
                </div>
            </div>
        </button>
    );
}
