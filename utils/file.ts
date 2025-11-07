export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('خواندن فایل با خطا مواجه شد'));
      }
    };
    reader.onerror = () => {
      reader.abort();
      reject(new Error('خواندن فایل با خطا مواجه شد'));
    };
    reader.readAsDataURL(file);
  });
}
