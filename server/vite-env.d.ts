/// <reference types="vite/client" />
declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string;
    VITE_API_URL?: string;
    // інші VITE_* змінні
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
