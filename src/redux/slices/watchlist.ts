import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import cmpData from '../../data/CoinMarketCapData';
import Coin from '../../models/Coin';
import { AppDispatch, AppThunk, RootState } from '../store/store';

// https://www.newline.co/@bespoyasov/how-to-use-thunks-with-redux-toolkit-and-typescript--1e65fc64

// This type describes the error object structure:
type FetchCoinError = {
  message: string;
};

// The third type-parameter is an object with:
// `{dispatch?, state?, extra?, rejectValue?}`` fields.
//
// `extra` is useful when we need to pass
// some static data to the request function,
// like jwt-token or HTTP-headers.
//
// `rejectValue` is useful when we need to type
// possible errors.
export const fetchCoin = createAsyncThunk<
  Coin[],
  void,
  { rejectValue: FetchCoinError }
>(
  'coins/fetch',
  // The second argument, `thunkApi`, is an object
  // that contains all those fields
  // and the `rejectWithValue` function:
  // or use the deconstructed { rejectWithValue } value
  async (_, { rejectWithValue }) => {
    // Will change when user can favorite coins
    const coins = ['BTC', 'XRP', 'BCH', 'ETH', 'DOGE', 'LTC'];

    let coinData: Coin[] = [];
    try {
      const cryptoResponse = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&relaxedValidation=true&fsyms=${coins.join()}`
      );

      // Check if status is not okay:
      if (cryptoResponse.status !== 200) {
        // Return the error message:
        return rejectWithValue({
          message: 'Failed to fetch coin prices.',
        });
      }

      const cryptoResponseData = await cryptoResponse.json();

      coins.forEach(coin => {
        // Find ID from CMP data, if it doesn't exist use 1
        const coinDetails = cryptoResponseData.RAW[coin].USD;
        const cmpDetails = cmpData.data.find(
          cmpCoin => coinDetails.FROMSYMBOL === cmpCoin.symbol
        );
        const coinID = cmpDetails?.id ?? 0;
        const coinName = cmpDetails?.name ?? 'Unknown';
        coinData.push(
          new Coin(
            coinID,
            coinName,
            coin,
            coinDetails.PRICE,
            coinDetails.CHANGEPCT24HOUR
          )
        );
      });
    } catch (err) {
      // You can choose to use the message attached to err or write a custom error
      // Return the error message:
      return rejectWithValue({
        message: 'Failed to fetch prices: ' + err,
      });
    }

    return coinData;
  }
);

// here we are typing the types for the state
type CoinState = {
  loading: boolean;

  // `error` will contain an error message.
  error: string | null;
  watchlistData: Coin[];
};

const initialState: CoinState = {
  watchlistData: [],
  error: null,
  loading: false,
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    // normal reducers
    updateWatchlist: (state, action: PayloadAction<Coin[]>) => {
      state.watchlistData = action.payload;
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  extraReducers: builder => {
    // When we send a request,
    // `fetchCoin.pending` is being fired:
    builder.addCase(fetchCoin.pending, state => {
      // At that moment,
      // we change loading to true
      // and clear all the previous errors:
      state.loading = true;
      state.error = null;
    });

    // When a server responses with the data,
    // `fetchCoin.fulfilled` is fired:
    builder.addCase(fetchCoin.fulfilled, (state, { payload }) => {
      // We add all the new watchlist into the state
      // and change `loading` back to `false`:
      state.watchlistData = payload;
      state.loading = false;
    });

    // When a server responses with an error:
    builder.addCase(fetchCoin.rejected, (state, { payload }) => {
      // We show the error message
      // and change `loading` back to `false`:
      if (payload) state.error = payload.message;
      state.loading = false;
    });
  },
});

// Actions generated from the slice
export const { updateWatchlist } = watchlistSlice.actions;

export const selectWatchlist = (state: RootState) => state.watchlist;

export const watchlistSelector = createSelector(
  selectWatchlist,
  state => state
);

// Actions
// export const updateCoinData = (newData: Coin[]): AppThunk => {
//   return async (dispatch: AppDispatch) => {
//     dispatch(updateWatchlist(newData));
//   };
// };

export default watchlistSlice.reducer;
