import {
  Text,
  Pressable,
  Alert
} from 'react-native';
import { GetDataset } from '../utils/async'


const CloseButton = (props) => {
  return (
      <Pressable 
          style={props.style}
          onPress={()=>props.handler()}>
          <Text style={{fontSize: 30, color:'white'}}>
              X
          </Text>
      </Pressable>
  )
}


const EditButton = (props) => {
  return (
      <Pressable 
          style={props.style}
          onPress={()=>props.handler()}>
          <Text style={{fontSize: 30, color:'white'}}>
              ⚙
          </Text>
      </Pressable>
  )
}


const CheckBox = (props) => {
  var ox;
  if(props.on){
      ox = 'O';
  }
  else{
      ox = 'X';
  }

  return (
    <Pressable
      style={props.style}
      onPress={()=>props.handler()}
    >
      <Text style={{
        fontSize: 25, 
        textAlign:'center', textAlignVertical:'center', 
        fontWeight:'bold'}}>
          {ox}
      </Text>
    </Pressable>
  )
}


function CheckIngExist (ing_id) {
  var ing_ids = ing_id.split('-');
  var groups = GetDataset("ingredients").ingredients;
    
  for(var i=0; i<ing_ids.length; i++){
    groups = groups.find((obj) => obj.id===ing_ids[i]);
    if (!groups.exist){
      return false;
    }
    groups = groups.children;
  }
  return true;
}


const CheckRecipeAvailable = (recipe_id) => {
  var recipe = GetDataset().recipe.recipe;

  var ings = recipe.find((obj)=>obj.id==recipe_id).ingredients;
  
  for(var i=0; i<ings.length; i++){
    if(!CheckIngExist(ings[i])){
      return false;
    }
  }
  return true;
}


const Ings2description = (ingredients, ingsList) => {
  var ing_array = ingredients.map((obj)=>obj.split('-'));
  var description = '';
  for(var i=0; i<ing_array.length; i++){
      let ingredientName = '';
      if(i>0){
          ingredientName += ', ';
      }
      let groups = ingsList;
      for(var j=0; j<ing_array[i].length-1; j++){
          groups = groups.find((obj) => obj.id===ing_array[i][j]).children;
      }
      ingredientName += groups.find((obj) => obj.id===ing_array[i][j]).name_kr;
      description += ingredientName;
  }
  return description
}


const createAlert = (msg) => {
  return Alert.alert( "Error", msg,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
}


export { 
  CloseButton, EditButton, CheckBox,
  CheckRecipeAvailable, Ings2description, CheckIngExist,
  createAlert,
}