import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true
    };
  }
});

export default function App() {

  useEffect(() => {

    async function configurePushNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if(finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if(finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Push notification need the appropriate permitions.'
        )
        return;
      };

      const pushNotificationData = Notifications.getExpoPushTokenAsync();
      console.log(pushNotificationData);

      if(Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT
        })
      }
    }

    configurePushNotification();
    
  }, [])

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(notification => {
      console.log('notofication recived');
      console.log(notification);
      const userName = notification.request.content.data.userName;
      console.log(userName);
    })

    const subscription2 = Notifications.addNotificationResponseReceivedListener( response => {
      console.log('notofication response recived');
      console.log(response);
      const userName = response.request.content.data.userName;
      console.log(userName);
    })

    return () => {
      subscription1.remove();
      subscription2.remove();
    }
  }, [])

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the body of the notification.',
        data: { userName: 'Max' }
      },
      trigger: {
        seconds: 5
      }
    });
  }

  function setPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'ExponentPushToken[]',
      title: 'Test - sent from a device',
      body: 'This is a test'
    }),
  });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler} />
      <Button title='Send Push Notification' onPress={setPushNotificationHandler} />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
