
import { ApiException } from '../../common/exception/api.exception';
import { ErrorCode } from '../../../../shared/error-code.constant';
import type { ApiResponse } from '../../types/api-response';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, body, ...requestOptions } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
      body,
    });
  } catch {
    throw new ApiException(
      ErrorCode.UNKNOWN_ERROR,
      'Unable to connect to the server.',
    );
  }

  let result: ApiResponse<T>;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiException(
      ErrorCode.UNKNOWN_ERROR,
      'Invalid server response.',
    );
  }

  if (!response.ok || result.code !== 'OK') {
    throw new ApiException(
      isErrorCode(result.code) ? result.code : ErrorCode.UNKNOWN_ERROR,
      result.message || 'API request failed.',
    );
  }

  return result.data;
}

function isErrorCode(code: string): code is ErrorCode {
  return Object.values(ErrorCode).includes(code as ErrorCode);
}
