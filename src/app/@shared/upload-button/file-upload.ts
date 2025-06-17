export type FileUpload = {
  type: string;
  filesToUpload: File[];
  filesUploaded: FileUploaded[];
  filesToRemove?: string[];
};

export type FileUploaded = {
  id: string;
  file: string;
  type: string;
  metadata: {
    size: number;
    filename: string;
    content_type: string;
  };
};
