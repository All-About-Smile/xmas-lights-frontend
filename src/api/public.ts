import client from './client'
import type { PublicPingResponse } from './types'

export async function fetchPublicPing(): Promise<PublicPingResponse> {
  const response = await client.get<PublicPingResponse>('/public/ping')
  return response.data
}
