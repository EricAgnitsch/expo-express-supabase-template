import {Stack} from 'expo-router';
import React from 'react';
import {NotificationProvider} from '../src/contexts/NotificationContext';

export default function AppLayout() {
  return (
    <NotificationProvider>
      <Stack>
        <Stack.Screen name={'index'}/>
      </Stack>
    </NotificationProvider>
  );
}