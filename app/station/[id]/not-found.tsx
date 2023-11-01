import {Stack} from '@/components/flex';
import Title from '@/components/title';
import Link from 'next/link';

const NotFound = () => {
    return (
        <main style={{padding: '24px 16px', maxWidth: 1024, margin: '0 auto'}}>
            <Stack gap={24}>
                <Title>Datos no encontrados</Title>
                <p style={{textAlign: 'center'}}>
                    No se han encontrado datos para esta estación meteorológica.
                </p>
                <p style={{textAlign: 'center'}}>
                    <Link href="/">Volver a la lista</Link>
                </p>
            </Stack>
        </main>
    );
};

export default NotFound;
