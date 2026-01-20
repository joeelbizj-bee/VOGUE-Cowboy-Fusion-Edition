
export interface TransformationState {
  originalImage: string | null;
  editedImage: string | null;
  isProcessing: boolean;
  error: string | null;
}

export enum ViewMode {
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW',
  RESULT = 'RESULT'
}
