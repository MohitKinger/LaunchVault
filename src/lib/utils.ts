import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const toHandle = (idea: string) =>
  idea
      .toLowerCase()
      .replace(/[^a-z0-9]/g,"")
      .slice(0,15);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));

}
