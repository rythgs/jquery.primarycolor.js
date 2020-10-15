export const isApproximateColor = (
  color1: string,
  color2: string,
  threshold = 35,
): boolean => {
  if (!color1 || !color2) {
    return false
  }
  const [r1, g1, b1] = color1.split(',').map(Number)
  const [r2, g2, b2] = color2.split(',').map(Number)
  const r = r1 - r2
  const g = g1 - g2
  const b = b1 - b2
  const l = Math.sqrt(r * r + g * g + b * b)
  return l < threshold
}

export const detectColor = (
  { data }: ImageData,
  skip = 0,
): [PrimaryColorObject, ColorCounter] => {
  const primary: PrimaryColorObject = { rgb: '', count: 0 }
  const colors: ColorCounter = {}
  // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
  for (let px = 0, len = data.length; px < len; px += (skip + 1) * 4) {
    // 透明度を持つものは無視
    // eslint-disable-next-line no-continue
    if (data[px + 3] < 255) continue
    const tmpRgb = `${data[px]},${data[px + 1]},${data[px + 2]}`
    // primary color との近似色判定を行い
    // 近似色と判断されたら rgb を入れ替える
    const rgb =
      primary.rgb && isApproximateColor(primary.rgb, tmpRgb)
        ? primary.rgb
        : tmpRgb
    // すでに同じ色が出現しているかカウント
    // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
    colors[rgb] = (colors[rgb] || 0) + 1
    if (colors[rgb] > primary.count) {
      primary.rgb = rgb
      primary.count = colors[rgb]
    }
  }
  return [primary, colors]
}

export class PrimaryColor {
  private primary = ''

  get primaryColor(): string {
    return this.primary
  }

  constructor(
    private element: HTMLImageElement,
    private options: PrimaryColorOptions,
  ) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = this.onLoad.bind(this)
    img.src = element.src
  }

  onLoad(e: Event): void {
    const imageData = PrimaryColor.getImageData(
      e.currentTarget as HTMLImageElement,
    )
    const [primaryColor, colors] = detectColor(imageData, this.options.skip)
    this.primary = primaryColor.rgb
    if (typeof this.options.callback === 'function') {
      this.options.callback.call(
        this.element,
        this.primary,
        PrimaryColor.sortColors(colors).slice(0, 5),
      )
    }
  }

  static getImageData = (img: HTMLImageElement): ImageData => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)
    return context.getImageData(0, 0, img.width, img.height)
  }

  static sortColors = (colors: ColorCounter): string[] =>
    Object.keys(colors).sort((a, b) => colors[b] - colors[a])
}
