"use client";

import { getStreams } from "@/lib/streams";
import { Stream } from "@/types/stream";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await getStreams();
        setStreams(data);
      } catch (err) {
        toast.error("Ошибка получения стримов");
      }
    };

    fetchStreams();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">StreamVault</h1>
    </main>
  );
}
