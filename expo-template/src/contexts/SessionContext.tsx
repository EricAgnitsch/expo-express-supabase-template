import {createClient} from '@supabase/supabase-js';
import {decode} from 'base-64';
import {deleteItemAsync, getItemAsync, setItemAsync} from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
import {createContext, JSX, useContext, useEffect, useState} from 'react';
import 'react-native-url-polyfill/auto'; // https://github.com/supabase/supabase/issues/8464

global.atob = decode; // https://forum.codewithmosh.com/t/invalidtokenerror-invalid-token-specified-invalid-base64-for-part-2-property-atob-doesnt-exist/23609/2 -- this is needed with the updated jwt-decode version

interface SessionProps {
  signIn: (email: string, password: string) => void,
  signOut: () => void,
  getAccessToken: () => Promise<string | null>,
  loggedIn: boolean,
  isAuthLoading: boolean
}

const SessionContext = createContext<SessionProps>({
  signIn: null,
  signOut: null,
  getAccessToken: null,
  loggedIn: false,
  isAuthLoading: true,
});

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_KEY);

const ACCESS_TOKEN = '_ACCESS_TOKEN_';
const REFRESH_TOKEN = '_REFRESH_TOKEN_';

const SessionProvider = (props: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    getItemAsync(REFRESH_TOKEN)
    .then(setRefreshToken)
    .then(() => getItemAsync(ACCESS_TOKEN)
    .then(setAccessToken));
  }, []);

  useEffect(() => {
    setIsAuthLoading(true);
    if (refreshToken && accessToken) {
      if (isFiveMinutesToExpiredToken(Date.now(), accessToken)) {
        supabase.auth.refreshSession({refresh_token: refreshToken})
                .then(response => {
                  if (response?.data?.session) {
                    const refresh_token = response.data.session.refresh_token;
                    const access_token = response.data.session.access_token;

                    setItemAsync(REFRESH_TOKEN, refresh_token)
                    .then(() => setRefreshToken(refresh_token))
                    .then(() => setItemAsync(ACCESS_TOKEN, access_token)
                    .then(() => setAccessToken(access_token)));
                  } else {
                    setRefreshToken(null);
                    setAccessToken(null);
                    setIsAuthLoading(false);
                  }
                });
      } else {
        setLoggedIn(true);
        setIsAuthLoading(false);
      }
    } else {
      setLoggedIn(false);
      setIsAuthLoading(false);
    }
  }, [accessToken]);

  const signIn = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    const refresh_token = data.session.refresh_token;
    const access_token = data.session.access_token;

    if (!error) {
      setItemAsync(REFRESH_TOKEN, refresh_token)
      .then(() => setRefreshToken(refresh_token))
      .then(() => {
        setItemAsync(ACCESS_TOKEN, access_token)
        .then(() => setAccessToken(access_token))
        .then(() => setLoggedIn(true));
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut()
                  .then(async () => await deleteItemAsync(REFRESH_TOKEN))
                  .then(async () => await deleteItemAsync(ACCESS_TOKEN))
                  .then(() => setRefreshToken(null))
                  .then(() => setAccessToken(null))
                  .then(() => setLoggedIn(false))
                  .then(() => setIsAuthLoading(false));
  };

  const isFiveMinutesToExpiredToken = (earlier: number, token: string): boolean => {
    const tokenExpInMilliseconds = jwtDecode(token)['exp'] * 1000;
    const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
    return (tokenExpInMilliseconds - earlier) <= FIVE_MINUTES_IN_MILLISECONDS;
  };

  const getValidAccessToken = async (): Promise<string | null> => {
    if (refreshToken && accessToken) {
      if (isFiveMinutesToExpiredToken(Date.now(), accessToken)) {
        const response = await supabase.auth.refreshSession({refresh_token: refreshToken});

        if (response?.data?.session) {
          const refresh_token = response.data.session.refresh_token;
          const access_token = response.data.session.access_token;

          setItemAsync(REFRESH_TOKEN, refresh_token)
          .then(() => setRefreshToken(refresh_token))
          .then(() => setItemAsync(ACCESS_TOKEN, access_token)
          .then(() => setAccessToken(access_token)));
          return access_token;
        } else {
          setRefreshToken(null);
          setAccessToken(null);
          setLoggedIn(false);
          return null;
        }
      }
      return accessToken;
    }
    return null;
  };

  return (
    <SessionContext.Provider value={{
      signIn: signIn,
      signOut: signOut,
      getAccessToken: getValidAccessToken,
      loggedIn: loggedIn,
      isAuthLoading: isAuthLoading,
    }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
export {SessionProvider};