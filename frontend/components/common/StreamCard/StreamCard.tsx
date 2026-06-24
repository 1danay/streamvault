import { Card } from "@/components/ui/Card";
import { Stream } from "@/types/stream";

interface StreamCardProps {
  stream: Stream & {
    user: {
      username: string;
      avatarUrl?: string;
    };
  };
}

const StreamCard = ({ stream }: StreamCardProps) => {
  const formattedDate = new Date(stream.scheduledAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return <Card className="hover:shadow-md "></Card>;
};

export default StreamCard;
