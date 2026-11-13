export const getImageData = (img: HTMLImageElement): ImageData => {
  const width = img.naturalWidth || img.width
  const height = img.naturalHeight || img.height

  if (!width || !height) {
    throw new Error('Image has no intrinsic size.')
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available.')
  }

  canvas.width = width
  canvas.height = height
  context.drawImage(img, 0, 0, width, height)

  return context.getImageData(0, 0, width, height)
}
