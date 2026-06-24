"use client";

import { Stream } from "@/types/stream";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import StreamCard from "@/components/common/StreamCard/StreamCard";
import { getStreams } from "@/lib/api/streams";

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

  return <h1 className="text-3xl font-bold">StreamVault</h1>;
}
