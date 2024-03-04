import Expo from 'expo-server-sdk';
import {supabase} from '../supabase/supabase-client';

const expo = new Expo();

export const notifyUser = async (userId: string, title: string, notificationMessage: string) => {
  let {data: user, error} = await supabase.from('users')
                                          .select('push_notification_token')
                                          .eq('id', userId)
                                          .single();

  let pushNotificationToken = user?.push_notification_token;

  if (Expo.isExpoPushToken(pushNotificationToken)) {
    let messages = [];

    messages.push({
      to: pushNotificationToken,
      sound: 'default',
      body: notificationMessage,
      title: title,
      // data: {withSome: 'data'},
    });

    try {
      let pushTicket = await expo.sendPushNotificationsAsync(messages);
      console.log('Push ticket ', pushTicket);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error(`Push token ${pushNotificationToken} is not a valid Expo push token`);
  }
};