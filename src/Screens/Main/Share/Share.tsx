import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Divider, Surface} from 'react-native-paper';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {Feather} from '@expo/vector-icons';
import {PageContainer} from '../../../Containers';
import {Header, Input, Text, Touchable} from '../../../Components';
import {useLanguage, useTheme} from '../../../Hooks';
import getStyles from './Share.styles';

const Share: React.FC = () => {
  const theme = useTheme();
  const language = useLanguage();

  const [message, setMessage] = useState('');
  const [medias, setMedias] = useState<ImagePicker.ImagePickerAsset[]>([]);

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

  const onSubmit = () => {};

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

            <Divider style={styles.divider} />
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
            <Divider style={styles.divider} />
          </View>

          <View style={styles.medias}>
            {medias.map((media) => (
              <Surface elevation={1} mode="elevated" style={styles.mediaContainer}>
                <View style={styles.mediaContent}>
                  <Image source={{uri: media.uri}} style={styles.media} />
                </View>
              </Surface>
            ))}

            <Surface elevation={1} mode="elevated" style={styles.mediaContainer}>
              <View style={styles.mediaContent}>
                <Touchable style={styles.mediaAddButton} onPress={onAddMediaPress}>
                  <Feather color={theme.colors.text} name="plus" size={64} />
                </Touchable>
              </View>
            </Surface>

            {/* To avoid the last element from growing to full width when it's single in the row */}
            <View style={styles.mediaContainer} />
          </View>
        </View>
      </ScrollView>

      <Surface elevation={2} style={styles.submitButton}>
        <Touchable onPress={onSubmit}>
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
