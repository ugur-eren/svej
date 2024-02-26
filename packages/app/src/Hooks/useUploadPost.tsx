import {createContext, memo, useContext, useRef} from 'react';
import PostUploader from '../Components/PostUploader/PostUploader';
import {useShowToast} from './useToast';
import {useLanguage} from './Language';

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
  const showToast = useShowToast();
  const language = useLanguage();

  const uploadPost: PostUploader['uploadPost'] = async (description, medias) => {
    if (!postUploader?.current?.uploadPost) return false;

    const status = await postUploader.current?.uploadPost(description, medias);

    if (status) {
      showToast({
        title: language.share.share_success_title,
        message: language.share.share_success_message,
        type: 'success',
      });
    }

    return status;
  };

  const isUploadActive = () => {
    return postUploader?.current?.isActive ?? false;
  };

  return {uploadPost, isUploadActive};
};
