const isDev = process.env.NODE_ENV === "development";

export const logger = {
    log: (...args: any[]) => {
        if (isDev) console.log(...args); // ✅ CAMBIAR POR console.log
    },
    warn: (...args: any[]) => {
        if (isDev) console.warn(...args);
    },
    error: (...args: any[]) => {
        if (isDev) console.error(...args);
    },
    info: (...args: any[]) => {
        if (isDev) console.info(...args);
    },
};