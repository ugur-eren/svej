import {createContext, memo, useContext, useRef} from 'react';
import PostUploader from '../Components/PostUploader/PostUploader';

export const PostUploaderContext = createContext<React.RefObject<PostUploader> | null>(null);

export const PostUploaderProvider: React.FC<{children?: React.ReactNode}> = memo(({children}) => {
  const ref = useRef<PostUploader>(null);

  return (
    <PostUploaderContext.Provider value={ref}>
      {children}

      <PostUploader ref={ref} />
    </PostUploaderContext.Provider>
  );
});

export const useUploadPost = () => {
  const postUploader = useContext(PostUploaderContext);

  const uploadPost: PostUploader['uploadPost'] = async (description, medias) => {
    if (!postUploader?.current?.uploadPost) return undefined;

    return postUploader.current?.uploadPost(description, medias);
  };

  const isUploadActive = () => {
    return postUploader?.current?.isActive ?? false;
  };

  return {uploadPost, isUploadActive};
};
