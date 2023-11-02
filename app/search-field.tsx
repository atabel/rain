'use client';
import * as React from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useId, useState, useTransition} from 'react';
import * as styles from './search-field.css';
import {vars} from './global.css';
import Link from 'next/link';

const SearchField = () => {
    const id = useId();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const search = searchParams.get('search') ?? '';
    const inputRef = React.useRef<HTMLInputElement>(null);

    const searchFor = (value: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set('search', value);
        } else {
            newSearchParams.delete('search');
        }
        startTransition(() => {
            router.replace(pathname + '?' + newSearchParams.toString());
        });
    };

    return (
        <div className={search ? [styles.field, styles.fieldWithValue].join(' ') : styles.field}>
            <div className={styles.searchIcon}>
                <svg height="24" viewBox="0 -960 960 960" width="24" fill={vars.colors.textSecondary}>
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
            </div>
            <label className={styles.label} htmlFor={id}>
                Buscar
            </label>
            <input
                ref={inputRef}
                defaultValue={search}
                id={id}
                className={styles.input}
                type="search"
                onChange={(e) => {
                    searchFor(e.target.value);
                }}
            />
            {isPending ? (
                <div className={styles.loadingIndicator}>
                    <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24">
                        <style>{`.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}`}</style>
                        <g className="spinner_V8m1">
                            <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
                        </g>
                    </svg>
                </div>
            ) : search ? (
                <button
                    className={styles.clearButton}
                    onClick={() => {
                        if (!inputRef.current) {
                            return;
                        }
                        inputRef.current.value = '';
                        inputRef.current.blur();
                        searchFor('');
                    }}
                >
                    <svg height="24" viewBox="0 -960 960 960" width="24" fill={vars.colors.text}>
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </button>
            ) : null}
        </div>
    );
};

export default SearchField;
