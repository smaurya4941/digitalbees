'use client';

import { useState, useRef } from 'react';
import { useMedia, useUploadMedia, useDeleteMedia } from '@/lib/admin/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Trash2, Copy, Image as ImageIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaLibraryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMedia(page);
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    toast.promise(uploadMutation.mutateAsync(file), {
      loading: 'Uploading...',
      success: 'File uploaded successfully!',
      error: 'Failed to upload file.',
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const isImage = (mime: string) => mime.startsWith('image/');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage images and documents for the website.
          </p>
        </div>
        
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
            onChange={handleFileSelect}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.data.map((item) => (
            <div 
              key={item.id} 
              className="group relative border rounded-lg overflow-hidden bg-muted/20 hover:border-primary transition-colors"
            >
              <div className="aspect-square flex items-center justify-center bg-muted/50 p-4">
                {isImage(item.mime_type) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              <div className="p-3">
                <p className="text-xs font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">
                  {(item.size / 1024).toFixed(1)} KB • {item.mime_type.split('/')[1]}
                </p>
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-24"
                  onClick={() => copyUrl(item.url)}
                >
                  <Copy className="mr-2 h-3 w-3" /> Copy URL
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="w-24"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this file?')) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          ))}

          {data?.data.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>No media files uploaded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
