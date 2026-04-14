import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type SubmitReviewParams = {
  userId: number;
  orderId: number;
  rating: number;
  comment?: string;
};

export async function submitReview(params: SubmitReviewParams) {
  try {
    const { data } = await axios.post(`${API_URL}/api/reviews`, {
      userId: params.userId,
      orderId: params.orderId,
      rating: params.rating,
      comment: params.comment,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = (error.response?.data ?? {}) as {
        error?: string;
        code?: string;
      };
      const err = new Error(responseData.error || error.message || "Request failed") as Error & {
        status?: number;
        code?: string;
      };
      err.status = error.response?.status;
      err.code = responseData.code;
      throw err;
    }
    const err = new Error("Request failed") as Error & {
      status?: number;
      code?: string;
    };
    throw err;
  }
}
