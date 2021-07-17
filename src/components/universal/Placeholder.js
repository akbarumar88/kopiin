import ContentLoader, {
  Facebook,
  Rect,
  Circle,
} from 'react-content-loader/native';
import {Dimensions, FlatList, View} from 'react-native';
import React, {Component} from 'react';

let windowWidth = Dimensions.get("window").width;

export const MerchantShimmer = props => {
  const {portrait} = props;

  let itemWidth = windowWidth / 5 - 2;
  let itemHeight = itemWidth * 2 - 5;

  let pictureWidth = windowWidth / 6 - 6;
  let pictureHeight = pictureWidth;
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={[1, 2, 3, 4, 5, 6]}
      keyExtractor={(item, index) => {
        return `${index}`;
      }}
      style={{}}
      contentContainerStyle={{}}
      renderItem={({item, index}) => {
        return (
          <ContentLoader height={itemHeight} width={itemWidth}>
            <Rect x="0" y="20" width={pictureWidth} height={pictureHeight} />
            <Rect x="0" y={pictureHeight + 5 * 1 + 20} width="40" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 3 + 20} width="35" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 5 + 20} width="40" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 7 + 20} width="45" height="5" />
          </ContentLoader>
        );
      }}
    />
  );
};

export const BarangShimmer = props => {
  const {portrait} = props;

  let itemWidth = windowWidth / 5 - 2;
  let itemHeight = itemWidth * 2 - 5;

  let pictureWidth = windowWidth / 6 - 6;
  let pictureHeight = pictureWidth;
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={[1, 2, 3, 4, 5, 6,7,8,9]}
      keyExtractor={(item, index) => {
        return `${index}`;
      }}
      style={{}}
      numColumns={3}
      contentContainerStyle={{}}
      renderItem={({item, index}) => {
        return (
          <ContentLoader height={itemHeight} width={itemWidth}>
            <Rect x="0" y="20" width={pictureWidth} height={pictureHeight} />
            <Rect x="0" y={pictureHeight + 5 * 1 + 20} width="40" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 3 + 20} width="35" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 5 + 20} width="40" height="5" />
            <Rect x="0" y={pictureHeight + 5 * 7 + 20} width="45" height="5" />
          </ContentLoader>
        );
      }}
    />
  );
};
