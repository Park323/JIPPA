import React, 
{ Component, 
  useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { HomePage, MenuBoard, Manager } from './pages'
import { ClearInfo, SaveUserInfo, GetUserInfo, InitializeDataset } from './utils/async.js'


// Initialize Data
ClearInfo();
if (GetUserInfo('id')){
  console.log('Savefile Exists');
}
else {
  console.log('Initialize Application Data');
  SaveUserInfo({data:{
                  id:0
                }});
  InitializeDataset();
}


const PageSelector = (props) => {
  if (props.currentPage === 'home') {
    return <HomePage handler={props.handler} style={styles}/>
  } 
  else if (props.currentPage === 'menu') {
    return <MenuBoard handler={props.handler} style={styles}/>
  }
  else if (props.currentPage === 'manage') {
    return <Manager handler={props.handler} style={styles}/>
  } 
  else {
    return <Text>NONE</Text>
  }
};

const Main = () => {
  
  var startpage = 'home';

  const [currentPage, setCurrentPage] = useState(startpage);
  
  return (
    <SafeAreaView style={styles.background}>
      <PageSelector currentPage={currentPage} handler={setCurrentPage} style={styles}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C'
  },
  container: {
    height: '100%',
    width: '100%',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  headText:{
    fontSize: 40,
    color: 'white',
  },
  nameText:{
    fontSize: 25,
    color: 'white',
  },
  subText:{
    fontSize: 15,
    color: '#E6E6E6',
    fontStyle: 'italic',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Main;