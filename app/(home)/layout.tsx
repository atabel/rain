import {Stack} from '@/components/flex';
import Title from '@/components/title';
import SearchField from '../search-field';

export default function RootLayout({
    children,
    header,
}: {
    children: React.ReactNode;
    header?: React.ReactNode;
}) {
    return (
        <main style={{padding: '24px 16px', maxWidth: 1024, margin: '0 auto'}}>
            <Stack gap={16}>
                <Title>{header ?? 'Estaciones'}</Title>
                <SearchField />
                {children}
            </Stack>
        </main>
    );
}
