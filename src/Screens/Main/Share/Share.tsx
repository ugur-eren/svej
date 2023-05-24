import {View, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Divider, Surface} from 'react-native-paper';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';
import {PageContainer} from '../../../Containers';
import {Header, Input, Text, Touchable} from '../../../Components';
import {useLanguage, usePromisedState, useTheme} from '../../../Hooks';
import getStyles from './Share.styles';

const initialValues = {
  message: '',
  medias: [],
  // TODO: tags
};

const Share: React.FC = () => {
  const theme = useTheme();
  const language = useLanguage();
  const [typeSelectorShown, setTypeSelectorShown] = usePromisedState(false);

  const styles = getStyles(theme);

  const hideTypeSelector = () => setTypeSelectorShown(false);
  const showTypeSelector = () => setTypeSelectorShown(true);

  const onFormSubmit = () => {};

  return (
    <PageContainer>
      <Header title={language.share.page_title} />

      <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <ScrollView>
              <View style={styles.content}>
                <View style={styles.topContainer}>
                  <View style={styles.topInner}>
                    <Feather
                      color={theme.colors.text}
                      name="edit-3"
                      size={24}
                      style={styles.topIcon}
                    />

                    <Text weight="semiBold">{language.share.detail}</Text>
                  </View>

                  <Divider style={styles.divider} />
                </View>

                <View>
                  <Input
                    value={values.message}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    error={errors.message}
                    placeholder={language.share.message_placeholder}
                    leftIcon="message-square"
                    multiline
                  />
                </View>
              </View>

              <View style={[styles.content, styles.noBottomMargin]}>
                <View style={styles.topContainer}>
                  <View style={styles.topInner}>
                    <Feather
                      color={theme.colors.text}
                      name="image"
                      size={24}
                      style={styles.topIcon}
                    />
                    <Text weight="semiBold">{language.share.media}</Text>
                  </View>
                  <Divider style={styles.divider} />
                </View>

                <View style={styles.images}>
                  <View style={styles.imageContainer}>
                    <Surface elevation={1} mode="elevated" style={styles.imageSurface}>
                      <View style={styles.imageContainerInner}>
                        <View style={styles.imageFix} />

                        <Touchable style={styles.imageInner} onPress={showTypeSelector}>
                          <>
                            <Feather color={theme.colors.text} name="plus" size={64} />
                            <View style={styles.imageTouchableFix} />
                          </>
                        </Touchable>
                      </View>
                    </Surface>
                  </View>

                  {values.medias.map(() => null)}
                </View>
              </View>
            </ScrollView>

            <Surface elevation={2} style={styles.submitButton}>
              <Touchable onPress={() => handleSubmit()}>
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

            {typeSelectorShown ? (
              <View style={styles.selectorContainer}>
                <TouchableOpacity style={styles.selectorContainer} onPress={hideTypeSelector} />

                <View style={styles.selectorInner}>
                  <Surface elevation={2}>
                    <Touchable style={styles.selectorOption}>
                      <Feather name="image" size={24} color={theme.colors.text} />

                      <Text weight="semiBold" style={styles.selectorOptionItem}>
                        {language.share.picture}
                      </Text>
                    </Touchable>
                  </Surface>

                  <Surface elevation={2}>
                    <Touchable style={styles.selectorOption}>
                      <Feather name="video" size={24} color={theme.colors.text} />

                      <Text weight="semiBold" style={styles.selectorOptionItem}>
                        {language.share.video}
                      </Text>
                    </Touchable>
                  </Surface>
                </View>
              </View>
            ) : null}
          </>
        )}
      </Formik>
    </PageContainer>
  );
};

export default Share;
