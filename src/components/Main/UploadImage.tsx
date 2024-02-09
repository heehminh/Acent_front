import { View, Platform, ActionSheetIOS, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import UploadModeModal from '../Common/UploadModeModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { imageState } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';

const imagePickerOption: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
  cameraType: 'back',
};

type UploadImageProps = {
  selectedImageUri: string;
  setSelectedImageUri: (value: string) => void;
}

const UploadImage = ({selectedImageUri, setSelectedImageUri}: UploadImageProps) => {
  // // TODO 포플러나무
  // const originalWidth = 517;
  // const originalHeight = 673;

  // TODO 열기구
  const originalWidth = 800;
  const originalHeight = 603;

  const [image, setImage] = useRecoilState(imageState);
  const handleImageChange = () => {
    if (selectedImageUri) {
      setImage({
        uri: selectedImageUri,
        width: originalWidth,
        height: originalHeight
      })
    }
  }

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  // 선택 사진 또는 촬영된 사진 정보
  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      return;
    }
    setSelectedImageUri(res.assets[0].uri);
    console.log('PickImage', res);
    navigation.push('DescriptionScreen')
  };

  useEffect(()=>{
    handleImageChange()
  }, [selectedImageUri])

  // 카메라 촬영
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  // 갤러리에서 사진 선택
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  // 안드로이드를 위한 모달 visible 상태값
  const [modalVisible, setModalVisible] = useState(false);


  const modalOpen = () => {
    if (Platform.OS === 'android') { // 안드로이드
      setModalVisible(true); // visible = true
    } else { // iOS
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onLaunchCamera();
          } else if (buttonIndex === 1) {
            onLaunchImageLibrary();
          }
        },
      );
    }
  };

  return ( 
    <>
      <View style={{marginBottom: 50, alignItems: 'center'}}>
        <View style={{width: '100%', height: '85%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={modalOpen} >
            <Entypo name="camera" color="black" size={60} />
          </TouchableOpacity>
        </View>
      </View>
      <UploadModeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary} />
    </>
  );
};

export default UploadImage;
