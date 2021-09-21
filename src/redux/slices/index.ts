import { combineReducers } from '@reduxjs/toolkit';
import news from './news';
import topmovers from './topmovers';
import watchlist from './watchlist';

const rootReducer = combineReducers({
  news,
  topmovers,
  watchlist,
});

export default rootReducer;
