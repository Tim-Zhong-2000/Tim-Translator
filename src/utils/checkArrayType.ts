export const NumberChecker = (val: number) =>
  typeof val === "number" || typeof val === "bigint";
export const BooleanChecker = (val: number) => typeof val === "boolean";
export const StringChecker = (val: number) => typeof val === "string";

export function checkArrayType<T>(arr: T[], checkFn: (val: T) => boolean) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (!checkFn(arr[i])) {
      return false;
    }
  }
  return true;
}
