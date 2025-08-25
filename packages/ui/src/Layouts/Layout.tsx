import {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
    type ReactNode,
    useMemo,
} from "react";
import { Sidebar } from "../Atoms/Sidebar/Sidebar.tsx";
import { Logo } from "../Atoms/Logo/Logo.tsx";
import { Toasts } from "../Atoms/Toasts/Toasts.tsx";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { ConfirmDialog } from "../Molecules/Dialog/ConfirmDialog.tsx";

type Props = PropsWithChildren<{
    header: ReactNode;
    sidebar: ReactNode;
}>;

const LayoutContext = createContext({
    setDrawer: (() => {}) as (v: boolean) => void,
});

export function Layout({ header, sidebar, children }: Props) {
    const [hasDrawer, setDrawer] = useState(false);
    const layoutContext = useMemo(
        () => ({
            setDrawer,
        }),
        [],
    );
    return (
        <LayoutContext value={layoutContext}>
            <div className="text-txt-primary bg-level-0">
                <header className="absolute z-2 left-0 right-0 px-4 flex items-center border-b border-border-solid h-12 bg-level-0">
                    <Logo className="w-9 h-9" />
                    <svg
                        className="mx-3 text-txt-tertiary"
                        width="8"
                        height="18"
                        viewBox="0 0 8 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1 17L7 1" stroke="currentColor" />
                    </svg>
                    {header}
                </header>
                <div className="flex h-screen" id="main">
                    <Sidebar>{sidebar}</Sidebar>
                    <main
                        className={clsx(
                            "overflow-y-auto w-full mt-12 transition-all duration-300",
                            hasDrawer && "pr-105",
                        )}
                    >
                        <div className="py-12 px-8 max-w-[1200px] w-full mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                <Toasts />
                <ConfirmDialog />
            </div>
        </LayoutContext>
    );
}

export function Drawer({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) {
    const { setDrawer } = useContext(LayoutContext);
    useEffect(() => {
        setDrawer(true);
        return () => {
            setDrawer(false);
        };
    }, []);
    return createPortal(
        <aside
            className={clsx(
                "absolute pt-20 top-0 right-0 w-105 px-6 pb-8 border-border-solid border-l h-screen",
                className,
            )}
        >
            {children}
        </aside>,
        document.body,
    );
}
