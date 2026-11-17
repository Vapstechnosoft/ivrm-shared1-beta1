interface MastersLayoutProps {
    children: React.ReactNode;
}

export default function MastersLayout({ children }: MastersLayoutProps) {
    return <div className='container py-6'>{children}</div>;
}
