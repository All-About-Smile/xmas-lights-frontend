import apiClient from "@/lib/apiClient";

/** 서버에서 내려오는 편지(목록) 아이템 */
export type LetterItem = {
  letter_number: number;
  writer_nickname: string;
  ornament_shape: string;
  ornament_color: string;
  is_event_ornament: boolean;
  created_at: string;
};

/** 목록 응답(네가 쓰던 형태 유지) */
export type LetterListResponse = {
  items: LetterItem[];
  limit: number;
  offset: number;
  hasNext: boolean;
  serverDate: string | null; // 서버가 내려주면 string, 없으면 null
};

export type CreateLetterBody = {
  writer_nickname: string;
  content: string;
  ornament_shape: string; // "acorn"
  ornament_color: string; // "yellow"
  password_for_edit: string;
};

export type EditSessionRequestBody = {
  password: string;
};

export type EditSessionResponse = {
  writer_nickname: string;
  content: string;
  ornament_shape: string;
  ornament_color: string;
};

export type UpdateLetterBody = {
  writer_nickname: string;
  content: string;
  ornament_shape: string;
  ornament_color: string;
  password: string;
};

/** (추가) 삭제 스펙이 확정이면 여기서 바로 붙여 */
export type DeleteLetterBody = {
  password: string;
};

/** POST /users/{userid}/letters */
export async function createUserLetter(userid: string, body: CreateLetterBody) {
  const { data } = await apiClient.post(`/users/${encodeURIComponent(userid)}/letters`, body);
  return data;
}

/** GET /users/{userid}/letters?limit=&offset= */
export async function getUserLetters(params: {
  userid: string;
  limit: number;
  offset: number;
}): Promise<LetterListResponse> {
  const { userid, limit, offset } = params;

  const { data } = await apiClient.get(`/users/${encodeURIComponent(userid)}/letters`, {
    params: { limit, offset },
  });

  return data;
}

/** POST /users/{userid}/letters/{letter_number}/edit  (비번 검증 + 기존 데이터 반환) */
export async function requestEditSession(params: {
  userid: string;
  letter_number: number;
  body: EditSessionRequestBody;
}): Promise<EditSessionResponse> {
  const { userid, letter_number, body } = params;

  const { data } = await apiClient.post(
    `/users/${encodeURIComponent(userid)}/letters/${letter_number}/edit`,
    body
  );

  return data;
}

/** PUT /users/{userid}/letters/{letter_number} */
export async function updateUserLetter(params: {
  userid: string;
  letter_number: number;
  body: UpdateLetterBody;
}) {
  const { userid, letter_number, body } = params;

  const { data } = await apiClient.put(
    `/users/${encodeURIComponent(userid)}/letters/${letter_number}`,
    body
  );

  return data;
}

/** (예상) DELETE /users/{userid}/letters/{letter_number} + body로 password 보내는 케이스 */
export async function deleteUserLetter(params: {
  userid: string;
  letter_number: number;
  body: DeleteLetterBody;
}) {
  const { userid, letter_number, body } = params;

  // axios는 delete에 body 넣을 때 config.data로 보내야 함
  const { data } = await apiClient.delete(
    `/users/${encodeURIComponent(userid)}/letters/${letter_number}`,
    { data: body }
  );

  return data;
}
