import {  Image, View, Dimensions, LayoutChangeEvent, SafeAreaView, TouchableOpacity, ScrollView, Platform, } from 'react-native'
import React, { useEffect, useState, useRef }  from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { heightSelector, uriSelector, widthSelector } from '../../../recoil/selector';
import { useRecoilValue } from 'recoil';
import SoundPlayer from 'react-native-sound-player'
import { useIsFocused } from '@react-navigation/native';
import AppText from '../../Common/Text/AppText';
import * as Progress from 'react-native-progress';
import theme from '../../../../theme';
import Feather from 'react-native-vector-icons/Feather'
import RNFetchBlob from 'rn-fetch-blob';
import { useQuery } from 'react-query';
import { getContentText } from '../../../api/contents';

const Contents = () => {
    const { data, isLoading, isError } = useQuery('contentText', getContentText);
    const [content, setContent] = useState('');
    const [audio, setAudio] = useState('');

    useEffect(()=>{
      if (data && data.data) {
        setContent(data.data.text_content);
        setAudio(data.data.audio_content);
      }
      
    }, [data])
    // const content = treeContent

    const uri = useRecoilValue(uriSelector);
    const originalWidth = useRecoilValue(widthSelector);
    const originalHeight = useRecoilValue(heightSelector);

    const screenWidth = Dimensions.get('window').width;
    const ratio = 1.0;
    const resizeWidth = screenWidth*ratio;
    const resizeHeight = (screenWidth*originalHeight*ratio) / originalWidth;
    const [play, setPlay] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null); 
    const [currentTime, setCurrentTime] = useState(0);
    const [durationTime, setDurationTime] = useState(0);
    const [height, setHeight] = useState(0)
    const [isEnd, setIsEnd] = useState(false);
    const [progressTime, setProgressTime] = useState(0);

    const measureTextLayout = async (e: LayoutChangeEvent) => {
        const { height } = e.nativeEvent.layout;
        setHeight(height);
    }
    
    const isFocused = useIsFocused(); // goBack으로 이전 페이지 돌아왔는지 체크 

    useEffect(()=>{
        if (isFocused || isEnd) {
            setPlay(false)
        }
    }, [isFocused, isEnd]);

    const scrollView = async () => {
      if (isEnd && !play) {
          return;
      }
      
      if (scrollViewRef.current) {
        const info = await SoundPlayer.getInfo();
        if (info && info.duration) {
            setDurationTime(info.duration);

            const scrollY = (currentTime / durationTime) * height - 30
            const scrollPosition = (scrollY > 0) ? scrollY : 0;
            scrollViewRef.current.scrollTo({ y:scrollPosition, animated: false });
        }
      }
  }

    useEffect(()=>{
        scrollView() 
        if (currentTime>0) {
            setProgressTime(currentTime / durationTime);
        }
        
    }, [play, currentTime, durationTime]);

    useEffect(()=>{
        const playSound = async () => {
          const filePath = Platform.OS === 'ios' ? `${RNFetchBlob.fs.dirs.DocumentDir}/temp.mp3` : 'temp.mp3';
          await RNFetchBlob.fs.writeFile(filePath, audio, 'base64');
          SoundPlayer.loadSoundFile('temp', 'mp3');
        }

        playSound();

        SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            if (success) {
                setPlay(false)
                setIsEnd(true)
            }
        });

    return () => {
      setPlay(false);
      SoundPlayer.pause();
    };
  }, [audio]);

  const onClickButton = () => {
    !play ? SoundPlayer.play() : SoundPlayer.pause()
    setPlay(!play)
  }

  useEffect(()=>{
    const updateCurrentTime = async () => {
      const { currentTime } = await SoundPlayer.getInfo();
      setCurrentTime(currentTime);
    };

    const interval = setInterval(updateCurrentTime, 100);

    return () => {
      clearInterval(interval);
    }
  });

  if (isLoading  || !data?.data || !data.data.text_content) {
    return (
      <Image source={require('../../../assets/image/loading.png')} style={{ zIndex: 1, width: '100%', height: '100%'}} resizeMode='cover' />
    )
  }

  if (isError) {
    return <AppText>Error</AppText>
  } 


  return (
    <>
      <SafeAreaView>
        <GestureHandlerRootView>
          <View  style={{  zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
              <Image source={{ uri: uri }} style={{ width: resizeWidth, height: resizeHeight }} />
              <View style={{ display: 'flex', flexDirection: 'row', margin: 20, alignContent:'center'}}>
                  <View style={{ marginRight: 10, display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                      <Progress.Bar progress={progressTime} width={resizeWidth-75} height={15} color={theme.cocoa}/>
                  </View>
                  
                  <TouchableOpacity onPress={onClickButton}>
                      <Feather name={play ? 'pause' : 'play'} size={35} color={theme.cocoa}/>
                  </TouchableOpacity>
              </View>
              <View> 
                  <ScrollView 
                  ref={scrollViewRef}
                  contentContainerStyle={{ width: resizeWidth-40, height: content.length*2 + 400, }} 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  >
                  <AppText style={{ color: theme.olive, fontSize: 16 }} onLayout={measureTextLayout}>{content}</AppText>
              </ScrollView>
            </View>
          </View>
          
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  )
}

export default Contents