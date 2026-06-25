"use client";

import { Stream } from "@/types/stream";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import StreamCard from "@/components/common/StreamCard/StreamCard";
import { getStreams } from "@/lib/api/streams";

export default function Home() {
  const [activeStreams, setActiveStreams] = useState<Stream[]>([]);
  const [scheduledStreams, setScheduledStreams] = useState<Stream[]>([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await getStreams();

        setActiveStreams(data.active);
        setScheduledStreams(data.upcoming);
      } catch (err) {
        toast.error("Ошибка получения стримов");
      }
    };

    fetchStreams();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">В эфире</h2>
        <div className="flex flex-row flex-wrap gap-4">
          {activeStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Ближайшие</h2>
        <div className="flex flex-row flex-wrap justify-between gap-3">
          {scheduledStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>
    </div>
  );
}
