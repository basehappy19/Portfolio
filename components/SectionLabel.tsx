export default function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
    return (
        <p data-reveal="left" className={`text-sm font-semibold tracking-wide ${dark ? "text-rose-300" : "text-accent"}`}>
            {children}
        </p>
    );
}
