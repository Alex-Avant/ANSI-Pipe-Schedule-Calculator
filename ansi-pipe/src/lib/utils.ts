import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatInch(value: number): string {
  return `${value.toFixed(3)}"`
}

export function formatMm(value: number): string {
  return `${value.toFixed(2)} mm`
}

export function formatWeight(value: number, unit: 'lb' | 'kg'): string {
  return `${value.toFixed(2)} ${unit === 'lb' ? 'lb' : 'kg'}`
}

export function formatArea(value: number, unit: 'in2' | 'mm2'): string {
  return `${value.toFixed(3)} ${unit === 'in2' ? 'in²' : 'mm²'}`
}

export function formatVolume(value: number, unit: 'in3' | 'L'): string {
  return `${value.toFixed(3)} ${unit === 'in3' ? 'in³' : 'L'}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function inchToMm(inches: number): number {
  return inches * 25.4
}

export function mmToInch(mm: number): number {
  return mm / 25.4
}
