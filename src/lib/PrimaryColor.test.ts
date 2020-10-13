import { PrimaryColor, isApproximateColor, detectColor } from './PrimaryColor'

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('error!'))
    img.onabort = () => reject(new Error('error!'))
    img.src = url
  })

// 右上が赤であとは緑な画像
// ■■□□
// ■■□□
// □□□□
// □□□□
const primaryGreenImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVJaHOwg4hCwOlkQFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhGaVqWbPBKBqlpFOxMVcflUMvCKIMAIYASRm6snMYhae4+sePr7exXiW97k/R1gpmAzwicRzTDcs4g3imU1L57xPHGFlSSE+Jx436ILEj1yXXX7jXHJY4JkRI5ueJ44Qi6UulruYlQ2VeJo4qqga5Qs5lxXOW5zVap2178lfGCpoKxmu0xxGAktIIgURMuqooAoLMVo1UkykaT/u4R9y/ClyyeSqgJFjATWokBw/+B/87tYsTk26SaE40Pti2x+jQGAXaDVs+/vYtlsngP8ZuNI6/loTmP0kvdHRokdA/zZwcd3R5D3gcgcYfNIlQ3IkP02hWATez+ib8sDALRBcc3tr7+P0AchSV8s3wMEhMFai7HWPd/d19/bvmXZ/PyztcotNxnx2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AoNBzI23l7kJQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAfSURBVAjXY/zPwMDAwMD4n4GBgYGJAQkwMvxHcFBkAHegAwXE9BqFAAAAAElFTkSuQmCC`

// 右上が緑であとは赤な画像
// □□■■
// □□■■
// ■■■■
// ■■■■
const primaryRedImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVJaHOwg4hCwOlkQFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhGaVqWbPBKBqlpFOxMVcflUMvCKIMAIYASRm6snMYhae4+sePr7exXiW97k/R1gpmAzwicRzTDcs4g3imU1L57xPHGFlSSE+Jx436ILEj1yXXX7jXHJY4JkRI5ueJ44Qi6UulruYlQ2VeJo4qqga5Qs5lxXOW5zVap2178lfGCpoKxmu0xxGAktIIgURMuqooAoLMVo1UkykaT/u4R9y/ClyyeSqgJFjATWokBw/+B/87tYsTk26SaE40Pti2x+jQGAXaDVs+/vYtlsngP8ZuNI6/loTmP0kvdHRokdA/zZwcd3R5D3gcgcYfNIlQ3IkP02hWATez+ib8sDALRBcc3tr7+P0AchSV8s3wMEhMFai7HWPd/d19/bvmXZ/PyztcotNxnx2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AoNBzIe6+tM3wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAfSURBVAjXY2T4z8DAwPCfkYGBgYGJAQkw/kfioMgAAHieAwXLWe9XAAAAAElFTkSuQmCC`

// 1pxのみ透過した赤あとは緑な画像
// ■□□□
// □□□□
// □□□□
// □□□□
const primaryGreenTransparentImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVJaHOwg4hCwOlkQFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhGaVqWbPBKBqlpFOxMVcflUMvCKIMAIYASRm6snMYhae4+sePr7exXiW97k/R1gpmAzwicRzTDcs4g3imU1L57xPHGFlSSE+Jx436ILEj1yXXX7jXHJY4JkRI5ueJ44Qi6UulruYlQ2VeJo4qqga5Qs5lxXOW5zVap2178lfGCpoKxmu0xxGAktIIgURMuqooAoLMVo1UkykaT/u4R9y/ClyyeSqgJFjATWokBw/+B/87tYsTk26SaE40Pti2x+jQGAXaDVs+/vYtlsngP8ZuNI6/loTmP0kvdHRokdA/zZwcd3R5D3gcgcYfNIlQ3IkP02hWATez+ib8sDALRBcc3tr7+P0AchSV8s3wMEhMFai7HWPd/d19/bvmXZ/PyztcotNxnx2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AoNCCIOt8IJ1wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAeSURBVAjXY/jPwHCG4T8CMjL8Z/jPgASYGNAAhgAAKwIJySGhH2MAAAAASUVORK5CYII=`

describe('isApproximateColor', () => {
  it('近似色であれば true', () => {
    const result = isApproximateColor('0,0,0', '1,1,1')
    expect(result).toBe(true)
  })
  it('引数が与えられなければ false', () => {
    const result1 = isApproximateColor('0,0,0', '')
    expect(result1).toBe(false)
    const result2 = isApproximateColor('', '1,1,1')
    expect(result2).toBe(false)
  })
})

describe('sortColors', () => {
  it('カラーパレット降順ソート確認', () => {
    const data = {
      '0,0,0': 1,
      '1,1,1': 20,
      '3,3,244': 2,
      '244,244,244': 5,
    }
    const result = PrimaryColor.sortColors(data)
    expect(result).toEqual(['1,1,1', '244,244,244', '3,3,244', '0,0,0'])
  })
})

describe('色検出テスト', () => {
  it('緑がプライマリな画像のテスト', async () => {
    const img = await loadImage(primaryGreenImage)
    const imageData = PrimaryColor.getImageData(img)
    const [{ rgb, count }, colors] = detectColor(imageData)
    expect(rgb).toEqual('0,255,0')
    expect(count).toEqual(12)
    expect(colors['255,0,0']).toEqual(4)
  })

  it('赤がプライマリな画像のテスト', async () => {
    const img = await loadImage(primaryRedImage)
    const imageData = PrimaryColor.getImageData(img)
    const [{ rgb, count }, colors] = detectColor(imageData)
    expect(rgb).toEqual('255,0,0')
    expect(count).toEqual(12)
    expect(colors['0,255,0']).toEqual(4)
  })

  it('透過色スキップテスト', async () => {
    const img = await loadImage(primaryGreenTransparentImage)
    const imageData = PrimaryColor.getImageData(img)
    const [{ rgb, count }, colors] = detectColor(imageData)
    expect(rgb).toEqual('0,255,0')
    expect(count).toEqual(15)
    expect(
      Object.values(colors).reduce((acc: number, crr: number) => acc + crr, 0),
    ).toEqual(15)
  })
})

describe('PrimaryColor', () => {
  it('getter', (done) => {
    const img = new Image()
    img.src = primaryGreenImage
    // eslint-disable-next-line no-new
    new PrimaryColor(img, {
      skip: 1,
      callback(primaryColor) {
        expect(primaryColor).toEqual('0,255,0')
        done()
      },
    })
  })

  it('getter', (done) => {
    const img = new Image()
    img.src = primaryGreenImage
    // eslint-disable-next-line no-new
    const pc = new PrimaryColor(img, {
      skip: 1,
      callback() {
        expect(pc.primaryColor).toEqual('0,255,0')
        done()
      },
    })
  })
})
