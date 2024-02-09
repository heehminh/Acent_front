import { View, Text, Image, Dimensions, SafeAreaView, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import ImageEditor from "@react-native-community/image-editor";
import { heightSelector, uriSelector, widthSelector } from '../../../recoil/selector';
import { useRecoilValue } from 'recoil';

const Coordinates = () => {
  const uri = useRecoilValue(uriSelector);
  const originalWidth = useRecoilValue(widthSelector);
  const originalHeight = useRecoilValue(heightSelector);

  // image resize 
  const [imageSize, setImageSize] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const ratio = 0.9;
  const resizeWidth = screenWidth*ratio;
  const resizeHeight = (screenWidth*originalHeight*ratio) / originalWidth;
  const [position, setPosition] = useState({left: 0, top: 0});

  // keyword, context 
  const [keyword, setKeyword] = useState("Box를 클릭해주세요!");
  const [context, setContext] = useState("ArtVisionXperience이 선정한 핵심포인트입니다");

  const [cropPath, setCropPath] = useState("");
  const [cropData, setCropData] = useState({
    offset: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    displaySize: { width: 0, height: 0 },
    quality: 1,
  });

  const [focusBox, setFocusBox] = useState(false);

  // TODO 서버에서 받아옴 
  const dict = {
    "열기구": {
        "coord": [
          [95, 43, 162, 112], [184, 35, 243, 110], [592, 5, 635, 65]
        ], 
        "context" : "열기구를 포함한 것은 고요하거나 환상적인 느낌을 더해주어, 아름다운 평화로운 환경을 시사합니다. 이 그림에서 두드러진 특징은 열기구, 계단식 밭들, 그리고 굽이치는 강입니다."
    },
    "계단식 밭": {
        "coord": [
          [0, 309, 800, 446]
        ],
        "context": "계단식 밭들과 같은 요소들은 인간의 경작을 시사하며, 아마도 벼밭이나 비슷한 농업용 계단식 경사지일 것입니다. 이 그림에서 두드러진 특징은 열기구, 계단식 밭들, 그리고 굽이치는 강입니다."
    },
    "굽이굽이 흐르는 강": {
        "coord": [
          [172, 240, 576, 322]
        ],
        "context": "이 그림에서 두드러진 특징은 열기구, 계단식 밭들, 그리고 굽이치는 강입니다."
    }
  }

  const handleImageLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setImageSize({ x, y, width, height });
  }

  const calculateCoordinates = (list: number[][]) => {
    const [x1, y1, x2, y2] = list[0];
    const x1_ = resizeWidth / originalWidth * x1 + imageSize.x;
    const y1_ = resizeHeight / originalHeight * y1 + imageSize.y;
    const x2_ = resizeWidth / originalWidth * x2 + imageSize.x;
    const y2_ = resizeHeight / originalHeight * y2 + imageSize.y;
    return [x1_, y1_, x2_, y2_];
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const cropImage = async (coordinates: number[]) => {
    const left = coordinates[0]; 
    const top =  coordinates[1];
    setPosition({left, top});

    const x1 = coordinates[0] * (originalWidth / resizeWidth);
    const y1 = coordinates[1] * (originalHeight / resizeHeight);
    const x2 = coordinates[2] * (originalWidth / resizeWidth);
    const y2 = coordinates[3] * (originalHeight / resizeHeight);

    setCropData({
      offset: { x: x1, y: y1 },
      size: {
        width: (x2 - x1),
        height: (y2 - y1)
      },
        displaySize: {
          width: coordinates[2] - coordinates[0], 
          height: coordinates[3] - coordinates[1]
        },
        quality: 1,
      });
  };

  useEffect(()=>{
    if (focusBox === false) {
      setCropData({
        offset: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        displaySize: { width: 0, height: 0 },
        quality: 1,
      });

      setKeyword("Box를 클릭해주세요!")
      setContext("ArtVisionXperience이 선정한 핵심포인트입니다")
    }
  }, [focusBox])

  useEffect(()=>{
    const fetchData = async () => {
      try { 
        const url = await ImageEditor.cropImage(uri, cropData);
        setCropPath(url);
      } catch (error) {
        console.log("cropImage 오류:", error);
      }
    }

    fetchData();
  
  }, [cropData, uri])
  
  const handleClickBounding = (key: string, coordinates: number[]) => {
    setFocusBox(true);
    setKeyword(key);
    setContext(dict[key as keyof typeof dict]['context']);

    cropImage(coordinates);
  };

  const renderBoundingBoxes = () => {
    return Object.keys(dict).map((key: string, index: number) => {
        const coordinates: ReturnType<typeof calculateCoordinates> = calculateCoordinates(dict[key as keyof typeof dict]['coord']);
        // const coordinates = coord[0];
        return (
            <TouchableOpacity 
                key={index}
                style={{
                  position: 'absolute',
                  left: coordinates[0], 
                  top: coordinates[1], 
                  width: coordinates[2] - coordinates[0], 
                  height: coordinates[3] - coordinates[1], 
                  borderWidth: 3, 
                  borderColor: getRandomColor(), 
                  opacity: focusBox ? 0.2 : 1.0
                }}
                onPress={()=> handleClickBounding(key, coordinates)}>
                <View key={index}/>
            </TouchableOpacity>
        )
    })
  }

  return (
    <SafeAreaView>
        <GestureHandlerRootView>
          <View 
            style={{width: '100%', height: screenHeight-55, display: 'flex', alignItems: 'center', marginTop: 20, marginBottom: 100,}}>
              { cropPath && 
                <Image 
                  source={{uri: cropPath}} 
                  style={{position: 'absolute', zIndex: 1, width: cropData.displaySize.width, height: cropData.displaySize.height,  left: position.left, top: position.top }} />
              }
              <TouchableOpacity onPress={()=>setFocusBox(false)} activeOpacity={1}>
                <Image source={{uri: uri}} style={{  width: resizeWidth, height: resizeHeight, opacity: focusBox ? 0.2 : 1.0 }} onLayout={handleImageLayout}/>
              </TouchableOpacity>
              {renderBoundingBoxes()}
              <Text style={{marginTop: 10, marginBottom: 10, fontSize: 24, fontWeight: '600'}} >{keyword}</Text>
              
              <ScrollView style={{width: resizeWidth }}>
                  <Text style={{"fontSize":16 }}>{context}</Text>
                  { cropData && (
                    <>
                    <Text>{resizeWidth}</Text>
                    <Text>{resizeHeight} </Text>
                    <Text>{imageSize.width}</Text>
                    <Text>{imageSize.height}</Text>
                  
                    <Text>{cropData.offset.x}</Text>
                    <Text>{cropData.offset.y}</Text>
                    <Text>{cropData.size.width}</Text>
                    <Text>{cropData.size.height}</Text>
                    <Text>{cropData.displaySize.width}</Text>
                    <Text>{cropData.displaySize.height}</Text>
                    </>
                  )}
              </ScrollView>
              
          </View>
        </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default Coordinates;
