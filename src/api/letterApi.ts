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
  ornament_shape: string; // 예: "acorn"
  ornament_color: string; // 예: "yellow"
  password_for_edit: string;
};

/** ✅ 작성 */
export async function createUserLetter(userid: string, body: CreateLetterBody) {
  const { data } = await apiClient.post(
    `/users/${encodeURIComponent(userid)}/letters`,
    body
  );
  return data;
}

/** ✅ 목록 조회 + serverDate(헤더 Date) */
export async function getUserLetters(params: {
  userid: string;
  limit: number;
  offset: number;
}): Promise<{
  items: LetterItem[];
  limit: number;
  offset: number;
  hasNext: boolean;
  totalCount: number;
  totalPages: number;
  serverDate: Date | null;
}> {
  const { userid, limit, offset } = params;

  const res = await apiClient.get(`/users/${encodeURIComponent(userid)}/letters`, {
    params: { limit, offset },
  });

  // 서버 시간(잠금 판정용): 응답 헤더 Date 활용
  const dateHeader = res.headers?.date as string | undefined;
  const serverDate = dateHeader ? new Date(dateHeader) : null;

  return {
    items: res.data.data.items as LetterItem[],
    limit: res.data.data.limit,
    offset: res.data.data.offset,
    hasNext: res.data.data.has_next,
    totalCount: res.data.data.total_count,
    totalPages: res.data.data.total_pages,
    serverDate,
  };
}

/** ✅ 수정 진입: 비밀번호 검증 + 기존 편지 내용 받아오기 */
export async function fetchLetterForEdit(params: {
  userid: string;
  letterNumber: number;
  password: string;
}): Promise<{
  letter_number: number;
  writer_nickname: string;
  content: string;
  ornament_shape: string;
  ornament_color: string;
}> {
  const { userid, letterNumber, password } = params;

  const res = await apiClient.post(
    `/users/${encodeURIComponent(userid)}/letters/${letterNumber}/edit`,
    { password }
  );

  // 백엔드 응답 형태에 따라 data / data.data 둘 중 하나일 수 있어서 안전 처리
  const payload = res.data?.data ?? res.data;

  return payload as {
    letter_number: number;
    writer_nickname: string;
    content: string;
    ornament_shape: string;
    ornament_color: string;
  };
}

/** ✅ 수정 저장 */
export async function updateUserLetter(params: {
  userid: string;
  letterNumber: number;
  writer_nickname: string;
  content: string;
  ornament_shape: string;
  ornament_color: string;
  password: string;
}) {
  const { userid, letterNumber, ...body } = params;

  const res = await apiClient.patch(
    `/users/${encodeURIComponent(userid)}/letters/${letterNumber}`,
    body
  );

  return res.data;
}

/** ✅ 삭제: DELETE /users/{userid}/letters/{letter_number} + body { password } */
export async function deleteUserLetter(params: {
  userid: string;
  letterNumber: number;
  password: string;
}) {
  const { userid, letterNumber, password } = params;

  // DELETE는 body 전달을 확실히 하기 위해 request 사용
  const res = await apiClient.request({
    method: "DELETE",
    url: `/users/${encodeURIComponent(userid)}/letters/${letterNumber}`,
    data: { password },
  });

  return res.data;
}
