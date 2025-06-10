"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out hover:underline hover:underline-offset-2 text-white md:text-[var(--violet)]"
      onClick={() => router.back()}
    >
      <ArrowLeft />
      <p className="font-medium">Volver</p>
    </div>
  )
}