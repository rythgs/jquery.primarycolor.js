export const getImageData = (img: HTMLImageElement): ImageData => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available.')
  }

  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  context.drawImage(img, 0, 0)

  return context.getImageData(0, 0, canvas.width, canvas.height)
}
