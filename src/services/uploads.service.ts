import apiClient from './apiClient';
import { MessageAttachment } from './messages.service';

export const uploadsService = {
  async uploadOne(file: File, onProgress?: (percent: number) => void): Promise<MessageAttachment> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post('/uploads', formData, {
      // undefined → le navigateur pose lui-même le Content-Type AVEC le boundary
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return res.data.data;
  },

  async uploadMany(files: File[], onProgress?: (percent: number) => void): Promise<MessageAttachment[]> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const res = await apiClient.post('/uploads/multiple', formData, {
      // undefined → le navigateur pose lui-même le Content-Type AVEC le boundary
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return res.data.data;
  },

  async remove(filename: string): Promise<void> {
    await apiClient.delete(`/uploads/${filename}`);
  },
};
