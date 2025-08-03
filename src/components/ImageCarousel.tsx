import React, { useEffect, useRef, useState } from 'react';
import { View, Image, FlatList, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, globalStyles } from '../styles/globalStyles';

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 160 }) => {
  const flatListRef = useRef<FlatList<string>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  };

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, images]);

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.image, { height }]} resizeMode="cover" />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / SCREEN_WIDTH);
          if (index !== activeIndex) setActiveIndex(index);
        }}
      />

      <View style={styles.dotsContainer}>
        {images.map((_, idx) => (
          <View
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            style={[styles.dot, idx === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    ...globalStyles.shadow,
  },
  image: {
    width: SCREEN_WIDTH - spacing.md * 2,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
  },
});

export default ImageCarousel;

