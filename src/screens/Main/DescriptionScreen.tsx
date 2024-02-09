import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Common/Header'
import Description from '../../components/Main/Description/Description'

const DescriptionScreen = () => {
  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
        <Header nextPage='FocusPointingScreen'/>
        <Description />
    </View>
  )
}

export default DescriptionScreen