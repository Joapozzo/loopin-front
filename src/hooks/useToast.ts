import toast from 'react-hot-toast';

export const useToast = () => {
    const showToast = (
        message: string, 
        type: 'success' | 'error' | 'info' = 'info', 
        delay: number = 0
    ) => {
        const showToastFn = () => {
            switch (type) {
                case 'success':
                    return toast.success(message, {
                        duration: 6000,
                        position: 'top-right',
                        style: {
                            background: '#10B981',
                            color: '#fff',
                            fontWeight: '500',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#10B981',
                        },
                    });
                case 'error':
                    return toast.error(message, {
                        duration: 6000,
                        position: 'top-right',
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                            fontWeight: '500',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#EF4444',
                        },
                    });
                default:
                    return toast(message, {
                        duration: 6000,
                        position: 'top-right',
                        icon: 'ℹ️',
                        style: {
                            background: '#3B82F6',
                            color: '#fff',
                            fontWeight: '500',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        },
                    });
            }
        };

        if (delay > 0) {
            setTimeout(showToastFn, delay);
        } else {
            showToastFn();
        }
    };

    return { showToast };
};