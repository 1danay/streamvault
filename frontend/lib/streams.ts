import { Stream } from "@/types/stream";
import { apiClient } from "./api-client";

export async function getStreams(): Promise<Stream[]> {
  try {
    const response = await apiClient.get<Stream[]>("/stream");

    return response.data;
  } catch (err) {
    console.error("Ошибка при загрузке премьер: ", err);

    throw new Error("Failed to fetch streams");
  }
}
