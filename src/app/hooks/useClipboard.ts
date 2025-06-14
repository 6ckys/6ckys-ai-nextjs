'use client';

import {useCallback} from 'react';
import {useToast} from "@/app/hooks/useToast";

export function useClipboard() {
    const {addToast} = useToast();

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            addToast('Copied to clipboard!', 'success');
            return true;
        } catch {
            addToast('Failed to copy to clipboard', 'error');
            return false;
        }
    }, [addToast]);

    return {copyToClipboard};
}