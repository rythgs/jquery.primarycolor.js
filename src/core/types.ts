export type RGBString = `${number},${number},${number}`

export interface ColorCounter {
  [rgb: string]: number
}

export interface PrimaryColorObject {
  rgb: RGBString | ''
  count: number
}

export interface PrimaryColorResult {
  color: RGBString | ''
  topColors: RGBString[]
  count: number
}

export type PrimaryColorCallback = (
  this: HTMLImageElement,
  primaryColor: RGBString | '',
  topColors: RGBString[],
) => void

export interface PrimaryColorOptions {
  skip?: number
  callback?: PrimaryColorCallback
}

export interface ResolvedPrimaryColorOptions {
  skip: number
  callback?: PrimaryColorCallback
}
