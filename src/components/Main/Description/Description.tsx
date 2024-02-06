import { Image, View, Text, Dimensions, LayoutChangeEvent, SafeAreaView, TouchableWithoutFeedback, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

type DescriptionProps = {
  uri: string;
  originalWidth: number;
  originalHeight: number;
}

const Description = ({uri, originalWidth, originalHeight}: DescriptionProps) => {
  // TODO 서버에서 받아옴 
  const content = "이 작품은 오일 페인트를 매체로 사용한 것으로 보이며, 질감과 빛이 반사되는 방식을 고려하면 아크릴일 수도 있습니다. 그림의 스타일은 현실주의적인 경향이 있으며 인상주의적인 영향을 받아 실제 장면의 생생한 모습을 포착하면서도 고요하고 다소 부드러운 특징을 가지고 있습니다. 초상은 풍경과 자연에 중점을 두고 있으며, 이는 현실주의와 인상주의 화가 모두에게 흔한 소재입니다. 그림은 시골에서 일어난 듯한 풍경을 묘사하고 있습니다. 가벼운 파란 하늘에 희미한 구름이 있는 가운데, 키 크고 날씬한 포플러 나무들이 나란히 세워져 있습니다. 나무의 녹색이 하늘의 어두운 톤과 전경의 황금빛 초록색과 대조를 이루며, 봄이나 초여름과 같은 계절을 시사합니다. 구도 중앙에는 작은 흰색 건물이 나무 아래에 있어 아마도 집이나 창고일 것으로 보이며, 이는 본질적으로 자연 풍경에 인간적인 요소를 도입합니다. 그림의 왼쪽 전경에는 창작자의 서명이 있어 창작자가 자신의 흔적을 남긴 위치를 나타냅니다. "

  const screenWidth = Dimensions.get('window').width;
  const ratio = 0.9;
  const resizeWidth = screenWidth*ratio;
  const resizeHeight = (screenWidth*originalHeight*ratio) / originalWidth;

  return (
    <SafeAreaView>  
      <GestureHandlerRootView>
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <Image source={{ uri: uri }} style={{width: resizeWidth, height: resizeHeight }} />
          <ScrollView 
            style={{ marginTop: 10, width: resizeWidth, height: 220 }} 
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ fontSize: 16 }}>{content}</Text>
          </ScrollView>
        </View>
      </GestureHandlerRootView>    
    </SafeAreaView>
  );
}

export default Description;