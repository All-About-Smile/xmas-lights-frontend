import apiClient from "@/lib/apiClient";

export type LetterItem = {
  letter_number: number;
  writer_nickname: string;
  ornament_shape: string;
  ornament_color: string;
  is_event_ornament: boolean;
  created_at: string;
};

export async function getUserLetters(params: {
  userid: string;
  limit: number;
  offset: number;
}): Promise<{
  items: LetterItem[];
  limit: number;
  offset: number;
  hasNext: boolean;
  serverDate: Date | null;
}> {
  const { userid, limit, offset } = params;

  const res = await apiClient.get(`/users/${encodeURIComponent(userid)}/letters`, {
    params: { limit, offset },
  });

  const dateHeader = res.headers?.date as string | undefined;
  const serverDate = dateHeader ? new Date(dateHeader) : null;

  return {
    items: res.data.data.items as LetterItem[],
    limit: res.data.data.limit,
    offset: res.data.data.offset,
    hasNext: res.data.data.has_next,
    serverDate,
  };
}
