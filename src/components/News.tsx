import React, { FC } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { newsSelector } from '../redux/slices/news';
import { useAppSelector } from '../redux/store/hooks';
import NewsList from './NewsList';

const News: FC = () => {
  const { loading, newsData, error } = useAppSelector(newsSelector);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.screen}>
      {newsData && <NewsList newsData={newsData} isHomeScreen={false} />}
      {error && <Text>Oops, something went wrong</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  screen: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 90,
  },
});

export default News;
