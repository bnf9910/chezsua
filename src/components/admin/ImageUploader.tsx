'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
}

// 이미지를 4MB 이하로 자동 압축
async function compressImage(file: File, maxSizeMB = 3.5): Promise<File> {
  // 4MB 이하면 그대로 사용
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let { width, height } = img;
      const maxDimension = 2400; // 최대 가로/세로 픽셀

      // 비율 유지하면서 크기 줄임
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // 품질 조절하면서 압축 (4MB 이하 될 때까지)
      let quality = 0.92;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.5) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Image load failed'));
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  value = [],
  onChange,
  folder = 'lookbooks',
  multiple = true,
  maxImages = 20,
  label = 'Images',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; status: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string | null> {
    try {
      // 1. 압축
      setProgress((prev) => prev ? { ...prev, status: '압축 중...' } : null);
      const compressed = await compressImage(file);

      // 2. 업로드
      setProgress((prev) => prev ? { ...prev, status: '업로드 중...' } : null);
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      // JSON 응답이 아닐 수도 있으니 텍스트로 먼저 받기
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return null; // JSON 파싱 실패 = 서버 에러
      }

      if (res.ok && data.ok) {
        return data.url;
      } else {
        alert(`업로드 실패: ${data.error || res.statusText}`);
        return null;
      }
    } catch (err) {
      alert('업로드 실패: ' + (err instanceof Error ? err.message : String(err)));
      return null;
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (value.length + fileArray.length > maxImages) {
      alert(`최대 ${maxImages}장까지만 업로드 가능합니다.`);
      return;
    }

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      setProgress({ current: i + 1, total: fileArray.length, status: '시작...' });
      const url = await uploadFile(fileArray[i]);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
    }

    setUploading(false);
    setProgress(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  }

  function removeImage(index: number) {
    if (!confirm('이 이미지를 제거하시겠습니까?')) return;
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const newValue = [...value];
    const [moved] = newValue.splice(from, 1);
    newValue.splice(to, 0, moved);
    onChange(newValue);
  }

  return (
    <div>
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label} {value.length > 0 && `(${value.length}/${maxImages})`}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-accent-green bg-accent-green/5'
            : 'border-line hover:border-ink-secondary bg-bg-soft'
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple}
          onChange={handleSelect}
          className="hidden"
        />

        {uploading && progress ? (
          <div>
            <div className="text-serif text-lg italic mb-2">{progress.status}</div>
            <div className="text-mono text-[11px] tracking-[0.15em] text-ink-muted">
              {progress.current} / {progress.total}
            </div>
            <div className="w-48 mx-auto mt-3 h-1 bg-line rounded overflow-hidden">
              <div
                className="h-full bg-accent-green transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto mb-3 text-ink-muted"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" />
              <polyline points="17 8 12 3 7 8" strokeLinejoin="round" />
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
            </svg>
            <div className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-secondary mb-1">
              Click to Upload or Drag &amp; Drop
            </div>
            <div className="text-mono text-[10px] text-ink-muted">
              JPG, PNG, WebP · 자동 압축됨
            </div>
          </>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4 max-md:grid-cols-2">
          {value.map((url, index) => (
            <div key={url + index} className="relative group aspect-square bg-bg-soft border border-line overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {index === 0 && (
                <span className="absolute top-2 left-2 text-mono text-[9px] tracking-[0.15em] uppercase bg-ink-primary text-bg-primary px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}

              <span className="absolute top-2 right-2 text-mono text-[9px] tracking-[0.1em] bg-bg-primary/90 text-ink-primary px-1.5 py-0.5 rounded">
                {index + 1}
              </span>

              <div className="absolute inset-0 bg-ink-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, index - 1);
                    }}
                    className="w-8 h-8 bg-bg-primary/90 text-ink-primary hover:bg-bg-primary rounded flex items-center justify-center"
                    title="앞으로"
                  >
                    ←
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="w-8 h-8 bg-red-500 text-white hover:bg-red-600 rounded flex items-center justify-center text-lg"
                  title="삭제"
                >
                  ×
                </button>

                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, index + 1);
                    }}
                    className="w-8 h-8 bg-bg-primary/90 text-ink-primary hover:bg-bg-primary rounded flex items-center justify-center"
                    title="뒤로"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-mono text-[10px] text-ink-muted mt-2 leading-relaxed">
        💡 첫 번째 이미지가 대표 이미지(Cover)로 사용됩니다. 큰 사진도 자동 압축되니 그대로 올리시면 됩니다.
      </p>
    </div>
  );
}
