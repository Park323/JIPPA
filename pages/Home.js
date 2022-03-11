import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
} from 'react-native';
import IMG_logo from '../assets/src/img/dog_1.png';


const StartButton = (props) => {
  return (
    <Pressable
      style={styles.button}
      onPress={() => props.onPress()}
    >
      <Text style={styles.buttonText}>
        {props.title}
      </Text>
    </Pressable>
  );
}


const HomePage = (props) => {
  
  return (
    <>
      <View style={styles.home}>
        <View style={styles.face}>
          <Image 
            style={styles.img}
            source={IMG_logo}
          />
          <Text style={{fontWeight:'bold'}}>
            JIPPA
          </Text>
        </View>
        <View style={styles.buttonSpace}>
          <StartButton title={'메뉴보기'} onPress={()=>props.handler('menu')}/>
          <StartButton title={'관리하기'} onPress={()=>props.handler('manage')}/>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  home : {
    width: '70%',
    height: '85%',
    //backgroundColor: 'pink',
  },
  face : {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'blue',
  },
  img : {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  buttonSpace : {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'skyblue',
  },
  button : {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#575757',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export { HomePage };