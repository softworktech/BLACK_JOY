"use client";

import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
}

export function AdminImageUpload({ value, onChange, label, className = '' }: AdminImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      <div 
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px]
          ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          ${preview ? 'p-2' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="relative w-full h-full min-h-[180px] flex items-center justify-center rounded-lg overflow-hidden group">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-[300px] object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
                className="gap-2"
              >
                <X size={16} />
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 pointer-events-none">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <UploadCloud size={32} className="text-orange-500" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
