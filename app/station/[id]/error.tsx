'use client';
import * as React from 'react';
import {Stack} from '@/components/flex';
import Title from '@/components/title';
import {useRouter} from 'next/navigation';

const ErrorPage = ({error, reset}: {error: Error & {digest?: string}; reset: () => void}) => {
    const router = useRouter();

    return (
        <main style={{padding: '24px 16px', maxWidth: 1024, margin: '0 auto'}}>
            <Stack gap={24}>
                <Title>Algo ha ido mal 😢</Title>
                <p style={{textAlign: 'center'}}>
                    Ha habido un problema intentando cargar los datos de la estación
                </p>
                <p style={{textAlign: 'center'}}>
                    <button
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            border: `1px solid #ccc`,
                            borderRadius: 8,
                            margin: 0,
                            padding: '8px 16px',
                            width: 'auto',
                            overflow: 'visible',
                            background: 'transparent',
                            color: 'inherit',
                            font: 'inherit',
                            lineHeight: 'normal',
                            WebkitFontSmoothing: 'inherit',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            router.refresh();
                            React.startTransition(() => {
                                reset();
                            });
                        }}
                    >
                        <svg fill="currentColor" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                        </svg>
                        Volver a intentar
                    </button>
                </p>
            </Stack>
        </main>
    );
};

export default ErrorPage;
