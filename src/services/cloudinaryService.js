const CLOUD_NAME = 'dpvpbfnld'
const UPLOAD_PRESET = 'kopikina_uploads'

export async function uploadToCloudinary(file, folder = 'references') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `kopikina/${folder}`)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Upload failed')
  }

  const data = await res.json()
  return {
    url:       data.secure_url,
    publicId:  data.public_id,
    format:    data.format,
    bytes:     data.bytes,
    fileName:  file.name,
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
