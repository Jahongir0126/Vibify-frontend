const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

export const uploadImageToCloudinary = async (file, type = 'avatar') => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chat_app');
    formData.append('folder', 'chat_app_diplom');

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки изображения');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Ошибка загрузки в Cloudinary:', error);
    throw new Error('Не удалось загрузить изображение');
  }
};

export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Если URL уже из Cloudinary, возвращаем как есть
  if (url.includes('cloudinary.com')) {
    return url;
  }
  
  // Для локальных URL возвращаем null
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return null;
  }
  
  return url;
}; 