import { RegisterProvider } from "@/context/RegisterContext"; 

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RegisterProvider>
            {children}
        </RegisterProvider>
    );
}