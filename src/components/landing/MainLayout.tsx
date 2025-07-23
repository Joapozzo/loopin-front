const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full min-h-screen overflow-x-hidden bg-[var(--background)]">
            <style jsx global>{`
                :root {
                    --background: #ffffff;
                    --white: #f9f9f9;
                    --white-100: #f4f4f4;
                    --foreground: #171717;
                    --black: #2a2727;
                    --violet-50: #e8e4ff;
                    --violet-100: #c6baff;
                    --violet-200: #8d76fe;
                    --violet: #7b61ff;
                    --rose-50: #f8a5b2;
                    --rose: #ff6b81;
                    --rose-100: #ff8092;
                }
            `}</style>
            {children}
        </div>
    );
};

export default MainLayout;