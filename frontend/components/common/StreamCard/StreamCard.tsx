import { Card, CardContent } from "@/components/ui/Card";
import { Stream } from "@/types/stream";
import Image from "next/image";
import Link from "next/link";

interface StreamCardProps {
  stream: Stream;
}

const StreamCard = ({ stream }: StreamCardProps) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formattedDate = new Date(stream.scheduledAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="hover:shadow-md w-full max-w-70 overflow-hidden flex flex-col border-none p-0">
      <Link href={`${API_BASE_URL}/stream/${stream.id}`}>
        <div className="relative w-full aspect-video bg-black">
          {stream.thumbnailUrl ? (
            <Image src={stream.thumbnailUrl} alt={stream.title} fill className="object-cover" sizes="max-w-70 100vw" />
          ) : (
            <div className="w-full h-full bg-neutral-700 animate-pulse" />
          )}

          {stream.isLive ? (
            <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">В ЭФИРЕ</span>
          ) : (
            <span className="absolute bottom-2 right-2 bg-neutral-600 text-white text-xs font-bold px-2 py-0.5 rounded"> {formattedDate}</span>
          )}
        </div>

        <div className="p-3 flex items-center text-white">
          <span className="text-lg font-medium block truncate w-full" title={stream.title}>
            {stream.title}
          </span>
        </div>
      </Link>
    </Card>
  );
};

export default StreamCard;
