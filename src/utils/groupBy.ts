import { RHey } from "../RHey";

export function groupBy<T, K extends keyof T>(
  array: RHey<T>,
  property: K
): { [key: string]: RHey<T> } {
  return array.reduce((groups, item) => {
    const key = item[property] as unknown as string;
    if (!groups[key]) {
      groups[key] = new RHey();
    }
    groups[key].push(item);
    return groups;
  }, {} as { [key: string]: RHey<T> });
}
