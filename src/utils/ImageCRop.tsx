'use client'
import Cropper from "react-easy-crop"
import { useState, useCallback } from "react"

interface Props {
  onConfirm: (croppedImage: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = url
  })

const getCroppedImg = async (imageSrc: string, croppedAreaPixels: any) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height)
  return canvas.toDataURL('image/jpeg')
}

export default function ImageUploader({ onConfirm }: Props) {
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => setImage(reader.result as string)
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!image || !croppedAreaPixels) return
    const cropped = await getCroppedImg(image, croppedAreaPixels)
    onConfirm(cropped)
    setImage(null)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {image && (
        <>
          <div style={{ position: "relative", width: "100%", height: 300 }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button type="button" onClick={handleConfirm}>Confirm</button>
        </>
      )}
    </div>
  )
}