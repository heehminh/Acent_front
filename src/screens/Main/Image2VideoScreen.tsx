import { View, TouchableOpacity, Dimensions, Image, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightSelector, uriSelector, widthSelector } from '../../recoil/selector';
import { useRecoilValue } from 'recoil';
import GoBack from '../../components/Common/GoBack';
import theme from '../../../theme';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getStatusBarHeight } from 'rn-statusbar-height';
import NextPage from '../../components/Common/NextPage';
import VideoShare from '../../components/Main/Video/VideoShare';
import { useQuery } from 'react-query';
import { getContentVideo } from '../../api/contents';
import AppText from '../../components/Common/Text/AppText';

const Image2VideoScreen = () => {
  const {data, isLoading, isError} = useQuery('contentVideo', getContentVideo);
  const [base64video, setBase64video] = useState('');
  
  useEffect(()=>{
    if (data && data.data) {
      setBase64video(data.data.video_content);
      console.log(base64video)
    }
  }, [data, base64video]);

  const [onPress, setOnPress] = useState(false);

  const uri = useRecoilValue(uriSelector);
  const originalWidth = useRecoilValue(widthSelector);
  const originalHeight = useRecoilValue(heightSelector);

  const screenWidth = Dimensions.get('window').width;
  const resizeHeight = (screenWidth*originalHeight) / originalWidth;

  const top = getStatusBarHeight();

  if (isLoading  || !data ) {
    return (
      <Image source={require('../../assets/image/loading.png')} style={{ zIndex: 1, width: '100%', height: '100%'}} resizeMode='cover' />
    )
  }

  if (isError) {
    return <AppText>Error</AppText>
  } 

  return (
    <View style={{backgroundColor: theme.backgroundWhite}}>

      <View style={{
          position: 'relative', width: '100%', height: '100%', backgroundColor: theme.backgroundWhite
        }}>
        { (onPress&&base64video) ? (
          <>
            <TouchableOpacity 
                style={{ zIndex:1, position: 'absolute', top: top+10, left :15, }} 
                onPress={()=>setOnPress(false)} >
              <AntDesign name="arrowleft" size={30} color={theme.cocoa} />
            </TouchableOpacity>
            <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Video 
              source={{ uri: `data:video/mpeg;base64,${base64video}` }}
              style={{
                  width: screenWidth,
                  height: resizeHeight,
              }}
              resizeMode={'stretch'}
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
            <View style={{ width: '100%', height: '100%', backgroundColor: theme.backgroundWhite, display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
              <Image source={{ uri: uri }} style={{ width: screenWidth, height: resizeHeight, opacity: 0.3, display:'flex', justifyContent: 'center', alignItems: 'center'}} />
              <TouchableOpacity
                onPress={() => setOnPress(true)}
                style={{position: 'absolute' }}
              >
                <MaterialCommunityIcons name="movie-open-play" color={theme.cocoa} size={80} />
              </TouchableOpacity>
              <VideoShare />
            </View>
            <NextPage nextPage='ReviewScreen' />
          </>
      )}
      </View>
    </View>
  )
}

export default Image2VideoScreen