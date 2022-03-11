import {
    Menu,
    Recipe,
    Ingredients,
} from '../assets/src/data'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAlert } from './utils';


const AsyncSave = (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      AsyncStorage.setItem(key, jsonValue, ()=>{
          console.log('Save Complete');
      })
    } catch (e) {
      console.log(e);
      console.log('failed');
    }
}


const AsyncLoad = (key) => {
    try {
        var jsonValue;
        AsyncStorage.getItem(key, (err, value)=>{
            jsonValue = value != null ? JSON.parse(value) : null;
        });
        return jsonValue;
    } catch(e) {
        console.log(e);
        console.log('Failed');
    }
}
      

const ClearInfo = () => {
    try {
        AsyncStorage.clear();
        console.log('Clear');
    } catch(e) {
        console.log('Clear Error');
    }
}


const SaveUserInfo = (props) => {
    AsyncSave('@user_info', props.data);
}


const GetUserInfo = () => {
    var info = AsyncLoad('@user_info');
    return info;
}


const InitializeDataset = () => {
    if (CheckItemRedundancy(Menu.menu, 'recipe_id')) {
        console.log('Error : menu are repeated!!!');
    }
    var data = {
        menu : Menu,
        recipe : Recipe,
        ingredients : Ingredients
    }
    AsyncSave('@dataset', data);
}


function GetDataset (name) {
    var info = AsyncLoad('@dataset');
    
    if (name!==undefined) {
        return info[name];
    }
    return info;
}


function SetData (key, value) {
    var data = GetDataset();
    data[key] = value;
    AsyncSave('@dataset', data);
    console.log('Data Modified..');
}


function SwitchExist (ing_id) {
    var ing_ids = ing_id.split('-');
    var Ingredients = GetDataset('ingredients');
    var groups = Ingredients.ingredients.find((obj) => obj.id===ing_ids[0]);
    var ing = groups.children.find((obj) => obj.id===ing_ids[1]);
    
    ing.exist = !ing.exist;
    SetData('ingredients', Ingredients);
}


const CheckItemRedundancy = (item, key) => {
    for (let i=0; i<item.length; i++){
        for (let j=i+1; j<item.length; j++){
            if (item[i][key] == item[j][key]){
                return true;
            }
        }
    }
    return false;
}


const AddMenuItem = (recipe_id) => {
    var Menu = GetDataset('menu');
    if (Menu.menu.find((obj)=>obj.recipe_id==recipe_id)){
        createAlert('Same Object Already Exists');
        console.log(GetDataset('menu').menu);
        return false;
    }
    
    Menu.menu.push({
        id : Menu.menu.length,
        recipe_id : recipe_id,
    });
    SetData('menu', Menu);
    return true;
}


const DeleteMenuItem = (menu_id) => {
    var Menu = GetDataset('menu');
    var Item = Menu.menu.find((obj)=>obj.id==menu_id);
    var delete_id = Menu.menu.indexOf(Item);
    Menu.menu.splice(delete_id, 1); //Delete Item
    for (var idx=menu_id+1; idx<Menu.menu.length+1; idx++){
        let item = Menu.menu.find((obj)=>obj.id==idx);
        item.id = item.id-1;
    }
    SetData('menu', Menu);
}


const MoveMenuItem = (menu_id, increase) => {
    var Menu = GetDataset('menu');
    var Item_x = Menu.menu.find((obj)=>obj.id==menu_id);
    var isChanged=false;
    if (increase){
        if (menu_id < Menu.menu.length) {
            var Item_y = Menu.menu.find((obj)=>obj.id==menu_id+1);
            Item_x.id++;
            Item_y.id--;
            isChanged=true;
        }
    }
    else {
        if (menu_id > 0) {
            var Item_y = Menu.menu.find((obj)=>obj.id==menu_id-1);
            Item_x.id--;
            Item_y.id++;
            isChanged=true;
        }
    }
    if (isChanged) { SetData('menu', Menu); }
    return isChanged
}


export { 
    ClearInfo,
    SaveUserInfo, GetUserInfo,
    InitializeDataset, GetDataset,
    SetData, SwitchExist,
    AddMenuItem, DeleteMenuItem, MoveMenuItem
}