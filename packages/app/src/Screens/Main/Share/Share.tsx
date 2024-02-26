import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconButton, Surface} from 'react-native-paper';
import {Image} from 'expo-image';
import {ResizeMode, Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import {Feather} from '@expo/vector-icons';
import {PageContainer} from '../../../Containers';
import {AutoGrid, Divider, Header, Input, Text, Touchable} from '../../../Components';
import {useLanguage, useShowDialog, useShowToast, useTheme, useUploadPost} from '../../../Hooks';
import getStyles from './Share.styles';
import {Spacing} from '../../../Styles';
import {ShareScreenProps} from '../../../Types';

const Share: React.FC<ShareScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();

  const [message, setMessage] = useState('');
  const [medias, setMedias] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const {uploadPost, isUploadActive} = useUploadPost();
  const showToast = useShowToast();
  const showDialog = useShowDialog();

  const styles = getStyles(theme);

  const onAddMediaPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: false,
      selectionLimit: 1,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      videoMaxDuration: 120,
      exif: false,
      quality: 0.75,
    });

    if (result.canceled) return;

    setMedias([...medias, ...result.assets]);
  };

  const onSharePress = () => {
    if (isUploadActive()) {
      showToast({
        title: language.share.share_in_progress_title,
        message: language.share.share_in_progress_message,
        type: 'warning',
      });
      return;
    }

    showDialog({
      title: language.share.dialog_title,
      message: language.share.dialog_message,
      actions: [
        {
          label: language.common.cancel,
          type: 'cancel',
        },
        {
          label: language.share.dialog_share_button,
          type: 'success',
          hideOnPress: true,
          onPress: onSubmit,
        },
      ],
    });
  };

  const onSubmit = async () => {
    uploadPost(message, medias);
    navigation.goBack();
  };

  return (
    <PageContainer>
      <Header title={language.share.page_title} />

      <ScrollView>
        <View style={styles.content}>
          <View style={styles.topContainer}>
            <View style={styles.topInner}>
              <Feather color={theme.colors.text} name="edit-3" size={24} style={styles.topIcon} />

              <Text weight="semiBold">{language.share.detail}</Text>
            </View>

            <Divider />
          </View>

          <View>
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder={language.share.message_placeholder}
              leftIcon="message-square"
              multiline
            />
          </View>
        </View>

        <View style={[styles.content, styles.noBottomMargin]}>
          <View style={styles.topContainer}>
            <View style={styles.topInner}>
              <Feather color={theme.colors.text} name="image" size={24} style={styles.topIcon} />
              <Text weight="semiBold">{language.share.media}</Text>
            </View>
            <Divider />
          </View>

          <AutoGrid itemSize={200} gap={Spacing.medium}>
            {medias.map((media) => (
              <AutoGrid.Element key={media.uri}>
                <View style={styles.mediaContainer}>
                  <View style={styles.mediaContent}>
                    {media.type === 'video' ? (
                      <Video
                        source={{uri: media.uri}}
                        isMuted
                        usePoster
                        resizeMode={ResizeMode.COVER}
                        style={styles.media}
                      />
                    ) : (
                      <Image source={{uri: media.uri}} style={styles.media} />
                    )}

                    <IconButton
                      onPress={() => setMedias((prev) => prev.filter((m) => m.uri !== media.uri))}
                      icon="x"
                      style={styles.mediaRemoveButton}
                    />
                  </View>
                </View>
              </AutoGrid.Element>
            ))}

            <AutoGrid.Element>
              <View style={styles.mediaContainer}>
                <View style={styles.mediaContent}>
                  <Touchable style={styles.mediaAddButton} onPress={onAddMediaPress}>
                    <Feather color={theme.colors.text} name="plus" size={64} />
                  </Touchable>
                </View>
              </View>
            </AutoGrid.Element>
          </AutoGrid>
        </View>
      </ScrollView>

      <Surface elevation={2} style={styles.submitButton}>
        <Touchable onPress={onSharePress}>
          <SafeAreaView edges={['bottom']} style={styles.submitButtonContent}>
            <Feather
              name="upload"
              size={24}
              color={theme.colors.primary}
              style={styles.submitIcon}
            />

            <Text color="primary" weight="semiBold" fontSize={16}>
              {language.share.share_button}
            </Text>
          </SafeAreaView>
        </Touchable>
      </Surface>
    </PageContainer>
  );
};

export default Share;
