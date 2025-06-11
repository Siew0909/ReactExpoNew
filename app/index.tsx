import { View, Text } from 'react-native'
import React from 'react'

const Landing = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontSize: 50, fontWeight: 500}}>Landing Page</Text>
    </View>
  )
}

export default Landing