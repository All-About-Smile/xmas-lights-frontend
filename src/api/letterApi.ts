import apiClient from "@/lib/apiClient";

export type LetterItem = {
  letter_number: number;
  writer_nickname: string;
  ornament_shape: string;
  ornament_color: string;
  is_event_ornament: boolean;
  created_at: string;
};

export type CreateLetterBody = {
  writer_nickname: string;
  content: string;
  ornament_shape: string;   // 예: "acorn"
  ornament_color: string;   // 예: "yellow"
  password_for_edit: string;

};

export async function createUserLetter(userid: string, body: CreateLetterBody) {
  const { data } = await apiClient.post(`/users/${userid}/letters`, body);
  return data;
}


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
