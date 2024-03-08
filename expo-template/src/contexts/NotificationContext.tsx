import * as Device from 'expo-device';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  removeNotificationSubscription,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import {createContext, JSX, useContext, useEffect, useRef, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {useSessionContext} from './SessionContext';

interface NotificationProps {
}

const NotificationContext = createContext<NotificationProps>({});

setNotificationHandler({
  handleNotification: async () => {
    const appState = AppState.currentState;

    // Check if the app is in the foreground
    if (appState === 'active') {
      // If the app is in the foreground, we choose not to show the notification
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    } else {
      // If the app is in the background, show the notification
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    }
  },
});

const NotificationProvider = (props: { children: JSX.Element | JSX.Element[] }) => {
  const {loggedIn, getAccessToken} = useSessionContext();

  const [notification, setNotification] = useState<any>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (loggedIn) {
      registerForPushNotificationsAsync()
      .then(expoToken => {
        getAccessToken()
        .then(accessToken => {
          fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/push-notification-token`, {
            method: 'PUT',
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            }),
            body: JSON.stringify({
              expoPushToken: expoToken,
            }),
          })
          .then(response => {
            if (response.status !== 200) {
              alert('Issue updating Expo push token');
            }
          });
        });
      });

      notificationListener.current = addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      responseListener.current = addNotificationResponseReceivedListener(response => {
        console.log('token ', response);
      });

      return () => {
        removeNotificationSubscription(notificationListener.current);
        removeNotificationSubscription(responseListener.current);
      };
    }
  }, [loggedIn]);

  async function registerForPushNotificationsAsync() {
    let token: string = '';

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const {status: existingStatus} = await getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  return (
    <NotificationContext.Provider value={{}}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
export {NotificationProvider};