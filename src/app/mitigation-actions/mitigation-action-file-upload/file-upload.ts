export type MAFile = {
  id: string;
  file: string;
  type: string;
  metadata: {
    size: number;
    filename: string;
    content_type: string;
  };
};
