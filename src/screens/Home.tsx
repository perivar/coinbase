import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  LogBox,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import HomeRewards from '../components/HomeRewards';
import HomeTopMovers from '../components/HomeTopMovers';
import HomeWatchList from '../components/HomeWatchList';
import { RootStackParamList } from '../navigation/AppNavigator';
import NewsList from '../components/NewsList';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { fetchNews, newsSelector } from '../redux/slices/news';
import Watchlist from '../components/Watchlist';
import TopMoversList from '../components/TopMoversList';
import { fetchCoin, watchlistSelector } from '../redux/slices/watchlist';
import { fetchTopMovers, topMoversSelector } from '../redux/slices/topmovers';
import Colors from '../constants/Colors';
import CBButton from '../components/CBButton';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const {
    loading: isLoadingWatchlist,
    watchlistData,
    error: errorWatchlist,
  } = useAppSelector(watchlistSelector);
  const {
    loading: isLoadingTopMovers,
    coinData: topMoversData,
    error: errorTopMovers,
  } = useAppSelector(topMoversSelector);
  const {
    loading: isLoadingNews,
    newsData,
    error: errorNews,
  } = useAppSelector(newsSelector);

  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      dispatch(fetchNews());
      dispatch(fetchTopMovers());
      dispatch(fetchCoin());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs([
      'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
    ]);
    loadData();
  }, [loadData]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => {
      setRefreshing(false);
    });
  }, [loadData, refreshing]);

  const ref = useRef(null);
  useScrollToTop(ref);

  if (isLoadingNews || isLoadingTopMovers || isLoadingWatchlist) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', marginBottom: 90 }}>
      <ScrollView
        style={{ flex: 1 }}
        ref={ref}
        refreshControl={
          <RefreshControl
            tintColor="rgb(233, 233, 243)"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 50,
            }}>
            <Image
              style={styles.image}
              source={require('../../assets/icons/1x/wallet.jpeg')}
            />
            <Text style={styles.title}>Welcome to Coinbase!</Text>
            <Text style={styles.subtitle}>
              Make your first investment today
            </Text>
            <CBButton title="Buy crypto" />
          </View>

          {watchlistData && <Watchlist coinData={watchlistData} />}
          {topMoversData && <TopMoversList coinData={topMoversData} />}

          {/* <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
            <HomeWatchList />
          </View>
          <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
            <HomeTopMovers />
          </View> */}
          <View style={{ paddingHorizontal: 20 }}>
            <HomeRewards />
          </View>

          {newsData && (
            <NewsList
              newsData={newsData}
              isHomeScreen={true}
              viewMoreHandler={() => {
                navigation.navigate('News');
              }}
            />
          )}
          {errorNews && (
            <Text>Oops, something went wrong while loading news</Text>
          )}
          {errorTopMovers && (
            <Text>Oops, something went wrong while loading top movers</Text>
          )}
          {errorWatchlist && (
            <Text>Oops, something went wrong while loading watchlist</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  image: {
    height: 250,
    width: 150,
    marginTop: 40,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 21,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 24,
    color: Colors.subtitle,
  },
});
export default Home;
