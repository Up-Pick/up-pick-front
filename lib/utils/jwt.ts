export interface JwtPayload {
  sub: string;
  memberNickname: string;
  exp: number;
  iat: number;
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    console.log('Decoded JWT payload:', payload);
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const getNicknameFromToken = (token: string | null): string | null => {
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload?.memberNickname || null;
};
