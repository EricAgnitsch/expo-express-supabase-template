import {Stack} from 'expo-router';
import React from 'react';
import {NotificationProvider} from '../src/contexts/NotificationContext';
import {SessionProvider} from '../src/contexts/SessionContext';

export default function AppLayout() {
  return (
    <SessionProvider>
      <NotificationProvider>
        <Stack>
          <Stack.Screen name={'index'}/>
        </Stack>
      </NotificationProvider>
    </SessionProvider>
  );
}