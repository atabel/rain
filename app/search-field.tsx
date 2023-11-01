'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useId, useState, useTransition} from 'react';
import * as styles from './search-field.css';

const SearchField = () => {
    const id = useId();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const search = searchParams.get('search') ?? '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchParams = new URLSearchParams([
            ...Array.from(searchParams).filter(([key]) => key !== 'search'),
            ['search', e.target.value],
        ]);
        startTransition(() => {
            router.replace(pathname + '?' + newSearchParams.toString());
        });
    };

    return (
        <div className={search ? [styles.field, styles.fieldWithValue].join(' ') : styles.field}>
            <label className={styles.label} htmlFor={id}>
                Buscar
            </label>
            <input
                defaultValue={search}
                id={id}
                className={styles.input}
                type="search"
                onChange={handleChange}
            />
            {isPending && (
                <div className={styles.loadingIndicator}>
                    <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24">
                        <style>{`.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}`}</style>
                        <g className="spinner_V8m1">
                            <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
                        </g>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default SearchField;
