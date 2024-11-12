import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Config from 'react-native-config'
import { ApiProvider } from './api'
import Overview from './screens/Overview'
import InvoiceInDetail from './screens/InvoiceInDetail'
import SearchCustomers from './screens/AddEditInvoice/SearchCustomers'
import SearchProducts from './screens/AddEditInvoice/SearchProducts'
import Confirmation from './screens/AddEditInvoice/Confirmation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView>
      <ApiProvider
        url={String(Config.API_URL)}
        token={String(Config.API_TOKEN)}
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Overview"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Overview" component={Overview} />
            <Stack.Screen name="InDetail" component={InvoiceInDetail} />
            <Stack.Screen name="SearchCustomers" component={SearchCustomers} />
            <Stack.Screen name="SearchProducts" component={SearchProducts} />
            <Stack.Screen name="Confirmation" component={Confirmation} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApiProvider>
    </GestureHandlerRootView>
  )
}
