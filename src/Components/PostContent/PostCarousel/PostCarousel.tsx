import {memo, useState, useCallback, useRef} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PostMedia from '../../PostMedia/PostMedia';
import Pagination from '../../Pagination/Pagination';
import {PostData} from '../PostContent.props';
import {PostCarouselProps} from './PostCarousel.props';
import styles from './PostCarousel.styles';

const PostCarousel: React.FC<PostCarouselProps> = (props) => {
  const {data} = props;

  const flatlistRef = useRef<FlatList>(null);

  const {width} = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);

  const PostCarouselItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({item, index}: {item: PostData; index: number}) => (
      <View style={{width}}>
        <PostMedia data={item} visible={activeSlide === index} />
      </View>
    ),
    [width, activeSlide],
  );

  // TODO: Flatlist keyExtractor

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        horizontal
        data={data}
        pagingEnabled
        disableIntervalMomentum
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={PostCarouselItem}
        initialNumToRender={2}
        windowSize={3}
        maxToRenderPerBatch={2}
        scrollEventThrottle={200}
        onScroll={({nativeEvent: event}) => {
          const currentIndex = Math.abs(
            Math.round(event.contentOffset.x / event.layoutMeasurement.width),
          );

          if (currentIndex !== activeSlide) setActiveSlide(currentIndex);
        }}
      />

      <View pointerEvents="box-none" style={styles.pagination}>
        <Pagination
          count={data.length}
          activeIndex={activeSlide}
          onDotPress={(index) => flatlistRef.current?.scrollToIndex({index})}
        />
      </View>
    </View>
  );
};

export default memo(PostCarousel);
