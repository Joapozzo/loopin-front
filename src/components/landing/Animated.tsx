const Animated = () => {
    return (
        <div className="fixed inset-0 z-0">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, var(--violet-50) 0%, var(--background) 50%, var(--rose-50) 100%)` }}></div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ backgroundColor: 'var(--violet-100)' }}></div>
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: 'var(--rose-50)' }}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: 'var(--violet-100)' }}></div>
            </div>
        </div>
    )
}

export default Animated;