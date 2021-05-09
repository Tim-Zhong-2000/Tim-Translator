export function errBody(errno: number, errmsg: string, reason?: string) {
  return {
    errno: errno,
    errmsg: errmsg,
    reason: reason,
  };
}
