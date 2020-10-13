interface PrimaryColorOptions {
  skip: number
  callback?: (primaryColor: string, topColors: string[]) => void
}

interface PrimaryColorGlobalOptions {
  options: PrimaryColorOptions
}

interface PrimaryColorFunction {
  (options: PrimaryColorOptions): JQuery
}

interface PrimaryColor
  extends PrimaryColorGlobalOptions,
    PrimaryColorFunction {}

interface JQuery {
  primaryColor: PrimaryColor
}

interface ColorCounter {
  [key: string]: number
}

interface PrimaryColorObject {
  rgb: string
  count: number
}
