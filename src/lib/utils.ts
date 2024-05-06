import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const txExplorer = (hash: string) =>
  `https://sepolia.etherscan.io/tx/${hash}`;
