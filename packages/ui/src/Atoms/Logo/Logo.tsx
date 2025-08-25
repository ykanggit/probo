type Props = {
    className?: string;
};

export function Logo({ className }: Props) {
    return (
        <img
            className={className}
            src="/favicons/apple-touch-icon-60x60.png"
            alt="Probo"
            width={60}
            height={60}
        />
    );
}
