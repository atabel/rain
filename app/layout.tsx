import type {Metadata} from 'next';
import {Analytics} from '@vercel/analytics/react';
import './global.css';
import './reset.css';

export const metadata: Metadata = {
    title: 'Pluviómetros',
    description:
        'Registro de lluvia de la red de estaciones meteorológicas la Agencia Estatal de Meteorología',

    metadataBase: new URL(
        process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : `http://localhost:${process.env.PORT || 3000}`
    ),
    openGraph: {
        images: ['/icon.svg'],
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="es">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
