'use client';
import { useRef, useEffect } from 'react';
import { useCreateLink } from '@/hooks/useLinks';
import { useFormStore } from '@/stores';
import { BaseModal } from '../../common';
import URLInput from './forms/URLInput';
import NameInput from './forms/NameInput';
import ExpirationSelect from './forms/ExpirationSelect';
import FormMessages from './FormMessages';
import FormActions from './FormActions';
import StartingDateInput from './forms/StartingDateInput';
import { logger } from '@/utils/logger';
import PasswordInput from './forms/PasswordInput';

interface CreateLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLinkModal({
    isOpen,
    onClose,
}: CreateLinkModalProps) {
    const createLink = useCreateLink();
    const {
        url,
        name,
        expiration,
        startingDate,
        password,
        result,
        setUrl,
        setName,
        setExpiration,
        setStartingDate,
        setPassword,
        setResult,
        resetForm,
    } = useFormStore();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const handleSubmit = async (formData: FormData) => {
        setResult(null);

        try {
            const response = await createLink.mutateAsync({
                url: formData.get('url') as string,
                name: (formData.get('name') as string) || undefined,
                startingDate:
                    (formData.get('startingDate') as string) || undefined,
                expiration: (formData.get('expiration') as string) || undefined,
                password: (formData.get('password') as string) || undefined,
            });

            if (response?.error) {
                setResult({ error: response.error });
            } else if (response?.success) {
                setResult({ slug: response.slug, url: response.url });
            }
        } catch (error) {
            logger.error('Error creating link', error);
            setResult({ error: 'An unexpected error occurred' });
        } finally {
            handleClose();
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Link"
            maxWidth="lg"
        >
            <FormMessages result={result} />
            <form ref={formRef} action={handleSubmit} className="space-y-2">
                <URLInput
                    value={url}
                    onChange={setUrl}
                    disabled={createLink.isPending}
                />

                <NameInput
                    value={name}
                    onChange={setName}
                    disabled={createLink.isPending}
                />

                {/* <SlugInput
                    value={customSlug}
                    onChange={setCustomSlug}
                    disabled={createLink.isPending}
                /> */}

                <StartingDateInput
                    value={startingDate}
                    onChange={setStartingDate}
                    disabled={createLink.isPending}
                />

                <ExpirationSelect
                    value={expiration}
                    onChange={setExpiration}
                    disabled={createLink.isPending}
                />

                <PasswordInput
                    value={password}
                    onChange={setPassword}
                    disabled={createLink.isPending}
                />

                <FormActions
                    isLoading={createLink.isPending}
                    url={url}
                    onCancel={handleClose}
                />
            </form>
        </BaseModal>
    );
}
