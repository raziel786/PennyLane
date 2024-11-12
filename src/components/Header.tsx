import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface HeaderProps {
  title: string
  disableBackButton?: boolean
}

const Header: React.FC<HeaderProps> = ({
  title,
  disableBackButton = false,
}) => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      {!disableBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'‹ Back'}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 80,
    backgroundColor: 'rgb(48, 63, 88)',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  backText: {
    paddingLeft: 8,
    color: 'white',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 32,
  },
})
