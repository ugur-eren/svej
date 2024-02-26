import type {ImagePickerAsset} from 'expo-image-picker';

export type PostUploaderRef = {
  uploadPost: (description: string, medias: ImagePickerAsset[]) => Promise<boolean>;
  isActive: boolean;
};
