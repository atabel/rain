'use client';
import Card from '@/components/card';
import {Stack} from '@/components/flex';
import IconButton from '@/components/icon-button';
import RainSummary from '@/components/rain-summary';
import {useRouter} from 'next/navigation';
import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';

const ErrorCard = ({title, resetErrorBoundary}: {title: string; resetErrorBoundary: () => void}) => {
    const router = useRouter();
    return (
        <Card
            title={title}
            right={
                <IconButton
                    label="Recargar"
                    onClick={() => {
                        router.refresh();
                        React.startTransition(() => {
                            resetErrorBoundary();
                        });
                    }}
                >
                    <svg fill="currentColor" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                    </svg>
                </IconButton>
            }
        >
            Ha ocurrido un error cargando los datos
        </Card>
    );
};

type Props = {
    title: string;
    children: React.ReactNode;
};

export const CardErrorBoundary = ({title, children}: Props) => {
    return (
        <ErrorBoundary
            fallbackRender={({resetErrorBoundary}) => (
                <ErrorCard title={title} resetErrorBoundary={resetErrorBoundary} />
            )}
        >
            {children}
        </ErrorBoundary>
    );
};

export const RainErrorBoundary = ({children}: {children: React.ReactNode}) => {
    return (
        <ErrorBoundary
            fallbackRender={({resetErrorBoundary, error}) => {
                if (error.digest === 'NEXT_NOT_FOUND') {
                    throw error; // Handle in not-found.tsx
                }
                return (
                    <Stack gap={24}>
                        <RainSummary />
                        <ErrorCard title="Últimas 24h" resetErrorBoundary={resetErrorBoundary} />
                    </Stack>
                );
            }}
        >
            {children}
        </ErrorBoundary>
    );
};
