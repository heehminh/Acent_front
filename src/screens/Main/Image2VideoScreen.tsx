import { View, TouchableOpacity, Dimensions, Image, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Common/Header'
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightSelector, uriSelector, widthSelector } from '../../recoil/selector';
import { useRecoilValue } from 'recoil';
import GoBack from '../../components/Common/GoBack';
import theme from '../../../theme';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getStatusBarHeight } from 'rn-statusbar-height';
// import OpenCV from '../../components/Main/Loading/OpenCV';

const Image2VideoScreen = () => {
  const video = require('../../assets/video/18.mp4');
  const [onPress, setOnPress] = useState(false);

  const uri = useRecoilValue(uriSelector);
  const originalWidth = useRecoilValue(widthSelector);
  const originalHeight = useRecoilValue(heightSelector);

  const screenWidth = Dimensions.get('window').width;
  const resizeHeight = (screenWidth*originalHeight) / originalWidth;

  const top = getStatusBarHeight();

  return (
    <View style={{backgroundColor: 'white'}}>

      <View style={{
          position: 'relative', width: '100%', height: '100%', backgroundColor: 'white'
        }}>
        { onPress ? (
          <>
            <TouchableOpacity 
                style={{ zIndex:1, position: 'absolute', top: top+10, left :15, }} 
                onPress={()=>setOnPress(false)}
            >
                <AntDesign name="arrowleft" size={30} color={theme.cocoa} />
            </TouchableOpacity>
            <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Video 
              source={video}
              style={{
                  width: screenWidth,
                  height: resizeHeight,
              }}
              resizeMode={'cover'}
              repeat={true}
              controls={true} 
              paused={false}
              onEnd={()=>setOnPress(false)}
              />
            </View>
          </>
        ): (
          <>
            <GoBack cocoa/>
            <View style={{ width: screenWidth, height: resizeHeight, backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
              <Image source={{ uri: uri }} style={{ width: screenWidth, height: resizeHeight, opacity: 0.3, position: 'absolute', top: top, left: 0, right: 0, bottom:0 }} />
              <TouchableOpacity
                onPress={() => setOnPress(true)}
              >
                <MaterialCommunityIcons name="movie-open-play" color={theme.cocoa} size={80} />
              </TouchableOpacity>
            </View>
          </>
      )}
      </View>
    </View>
  )
}

export default Image2VideoScreen