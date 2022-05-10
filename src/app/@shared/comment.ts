export interface Comments {
  moduleIndex?: number;
  module: string;
  subModule: string;
  comment: string;
}

export interface CommentsStructure {
  module: string;
  fields: string[];
}
