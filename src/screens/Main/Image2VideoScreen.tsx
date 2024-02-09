import { View, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Common/Header'
import Video from 'react-native-video';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightSelector, uriSelector, widthSelector } from '../../recoil/selector';
import { useRecoilValue } from 'recoil';

const Image2VideoScreen = () => {
  const video = require('../../assets/video/output3.mp4');
  const [onPress, setOnPress] = useState(false);

  const uri = useRecoilValue(uriSelector);
  const originalWidth = useRecoilValue(widthSelector);
  const originalHeight = useRecoilValue(heightSelector);

  const screenWidth = Dimensions.get('window').width;
  const ratio = 0.9;
  const resizeWidth = screenWidth*ratio;
  const resizeHeight = (screenWidth*originalHeight*ratio) / originalWidth;

  return (
    <View style={{backgroundColor: 'white'}}>

      <View style={{
          position: 'relative', width: '100%', height: '100%', backgroundColor: 'white'
        }}>
        { onPress ? (
          <>
            <View style={{position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 1}}>
              <Header nextPage="MainScreen" /> 
            </View>
            <Video 
            source={video}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }}
            resizeMode={'contain'}
            repeat={true}
            controls={false} // TODO 논의 필요
            paused={false}
            onEnd={()=>setOnPress(false)}
            />
          </>
        ): (
          <>
            <View style={{ position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 1 }}>
              <Header nextPage="MainScreen" />
            </View>
            <View style={{ flex: 1, alignItems: 'center', marginTop: 20, backgroundColor: 'white' ,position: 'absolute', alignSelf: 'center',justifyContent: 'center', left: 0, right: 0, top: 0, bottom: 0 }}>
              <Image source={{ uri: uri }} style={{ width: resizeWidth, height: resizeHeight, opacity: 0.5 }} />
              <TouchableOpacity
                onPress={() => setOnPress(true)}
                style={{ position: 'absolute', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <MaterialIcons name="video-vintage" color="black" size={80} />
              </TouchableOpacity>
            </View>
          </>
      )}
      </View>
    </View>
  )
}

export default Image2VideoScreen