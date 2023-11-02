import type {Metadata} from 'next';
import './global.css';
import './reset.css';

export const metadata: Metadata = {
    title: 'Pluviómetros',
    description:
        'Registro de lluvia de la red de estaciones meteorológicas la Agencia Estatal de Meteorología',
    openGraph: {
        images: ['/icon.svg'],
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
