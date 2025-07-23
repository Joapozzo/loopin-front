"use client";
import Dashboard from "@/components/Dashboard";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";

export default function Page() {
  useWelcomeMessage()
  return (
    <Dashboard />
  );
}