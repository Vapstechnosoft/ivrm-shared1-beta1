export default function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="h-full w-full">
            {children}
        </section>
    )
}
