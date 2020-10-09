export class PrimaryColor {
  private primary = {
    rgb: '',
    count: 0,
  }

  get primaryColor(): string {
    return this.primary.rgb
  }

  constructor(
    private element: HTMLElement,
    private options: PrimaryColorOptions,
  ) {
    if (!(element instanceof Image)) {
      return
    }
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = this.onLoad.bind(this)
    img.src = element.src
  }

  onLoad(e: Event): void {
    const { data } = PrimaryColor.getImageData(
      e.currentTarget as HTMLImageElement,
    )
    const pixelLength = data.length / 4
    // 取得した色の出現回数を格納
    const colors: ColorCounter = {}
    // 1px ごとに画像データを走査する ( 1px ごとに rgba の 4 要素ある )
    for (let px = 0; px < pixelLength; px += this.options.skip * 4) {
      // 透明度を持つものは無視
      if (data[px + 3] < 255) {
        // eslint-disable-next-line no-continue
        continue
      }

      const tmpRgb = [data[px], data[px + 1], data[px + 2]].join(',')
      // primary color との近似色判定を行い
      // 近似色と判断されたら rgb を入れ替える
      const rgb =
        this.primary.rgb &&
        PrimaryColor.isApproximateColor(this.primary.rgb, tmpRgb)
          ? this.primary.rgb
          : tmpRgb

      // すでに同じ色が出現しているかカウント
      // 保持しているプライマリカラーより出現回数が多くなったら入れ替え
      colors[rgb] = colors[rgb] || 0
      // eslint-disable-next-line no-plusplus
      const count = ++colors[rgb]
      if (count > this.primary.count) {
        this.primary.rgb = rgb
        this.primary.count = count
      }
    }

    if (typeof this.options.callback === 'function') {
      this.options.callback.call(
        this.element,
        this.primary.rgb,
        PrimaryColor.sortColors(colors).slice(0, 5),
      )
    }
  }

  static getImageData(img: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)
    return context.getImageData(0, 0, img.width, img.height)
  }

  static isApproximateColor(color1: string, color2: string): boolean {
    if (!color1 || !color2) {
      return false
    }
    const c1 = color1.split(',').map(Number)
    const c2 = color2.split(',').map(Number)
    const r = c1[0] - c2[0]
    const g = c1[1] - c2[1]
    const b = c1[2] - c2[2]
    const l = Math.sqrt(r * r + g * g + b * b)
    return l < 60
  }

  static sortColors(colors: ColorCounter): string[] {
    return Object.keys(colors).sort((a, b) => colors[b] - colors[a])
  }
}
