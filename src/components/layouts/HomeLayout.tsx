export default function HomeLayout({ children }: { children: React.ReactNode }) { 
    return (
      <div className="flex flex-col items-center justify-center p-5 h-100vh overflow-y-auto gap-5">
        {children}
      </div>
    );
}