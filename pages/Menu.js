import React, 
{ Component, 
  useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  Modal,
} from 'react-native';
import IMG_logo from '../assets/src/img/logo.png';
import SOLD_OUT from '../assets/src/img/soldout.png';
import { CheckRecipeAvailable, CloseButton, EditButton, Ings2description } from '../utils/utils'
import { 
    GetDataset,
    AddMenuItem, DeleteMenuItem, MoveMenuItem, GetUserInfo
} from '../utils/async'
import { RecipeComponent } from './Manage';



const EditorButton = (props) => {
    return (
        <Pressable 
        style={styles.editorButton}
        onPress={()=>{
            props.handler();
            if (props.update){ props.update(); }
        }}>
            <View>
                <Text style={{fontSize: 20}}>
                    {props.text}
                </Text>
            </View>
        </Pressable>
    )
}


const Editor = (props) => {
    if (props.selected_id===undefined) {
        return (
            <View style={styles.tail_edit}>
                <EditorButton text='뒤로' handler={props.exit} update={props.update}/>
                <EditorButton text='+' handler={()=>props.onModal(true)}/>
            </View>
        )    
    }
    else {
        return (
            <View style={styles.tail_edit}>
                <EditorButton text='뒤로' handler={()=>{
                    props.select(undefined);
                }}/>
                <EditorButton text='▲' handler={()=>{
                    if (MoveMenuItem(props.selected_id, false)) { props.select(props.selected_id-1); }
                }} update={props.update}/>
                <EditorButton text='▼' handler={()=>{
                    if (MoveMenuItem(props.selected_id, true)) { props.select(props.selected_id+1); }
                }} update={props.update}/>
                <EditorButton text='삭제' handler={()=>DeleteMenuItem(props.selected_id)} update={props.update}/>
            </View>
        )
    }
}


const MenuShort = (props) => {
    
    if (props.id==props.selected_id) { var style = styles.scrollComponent_edit; }
    else { var style = styles.scrollComponent; }

    var isSoldOut;
    if(!CheckRecipeAvailable(props.recipe_id)){
        isSoldOut = <Image style={styles.soldoutMark} source={SOLD_OUT}/>
    }
    else{
        isSoldOut = undefined;
    }

    if (props.editMode) {
        return (
            <Pressable 
            style={style}
            onPress={()=>{ 
                if (props.selected_id===props.id) { props.selectObj(undefined); }
                else { props.selectObj(props.id); }
            }}>
                <View>
                    <View style={styles.nameComponent}>
                        <Text style={props.style.nameText}>
                            {GetDataset('recipe').recipe.find((obj) => obj.id===props.recipe_id).name_kr}
                        </Text>
                    </View>
                    <View style={styles.subComponent}>
                        <Text style={props.style.subText}>
                            {GetDataset('recipe').recipe.find((obj) => obj.id===props.recipe_id).short_description}
                        </Text>
                    </View>
                </View>
                {isSoldOut}
            </Pressable>
        )
    }
    else {
        return (
            <View style={styles.scrollComponent}>
                <View style={{flex: 9}}>
                    <View style={styles.nameComponent}>
                        <Text style={props.style.nameText}>
                            {GetDataset('recipe').recipe.find((obj) => obj.id===props.recipe_id).name_kr}
                        </Text>
                    </View>
                    <View style={styles.subComponent}>
                        <Text style={props.style.subText}>
                            {GetDataset('recipe').recipe.find((obj) => obj.id===props.recipe_id).short_description}
                        </Text>
                    </View>
                </View>
                <Pressable 
                style={{flex: 1}}
                onPress={()=>{
                    props.select(props.recipe_id);
                    props.handler(true);
                }}>
                    <Text style={{fontSize: 30, color:'white'}}>
                        ⋯
                    </Text>
                </Pressable>
                {isSoldOut}
            </View>
        )
    }
}


const Detail = (props) => {
    
    var recipe = GetDataset('recipe').recipe.find((obj) => obj.id===props.menu)
    return (
        <>
            <View style={styles.descContainer}>
                <View style={styles.descImg}>
                    <Image 
                        style={styles.image}
                        source={IMG_logo}
                    />
                </View>
                <View style={styles.descName}>
                    <Text style={styles.descNameText}>
                        {recipe.name_kr}
                    </Text>
                </View>
                <View style={styles.description}>
                    <View style={styles.descIngArea}><Text>
                        재료 : {Ings2description(recipe.ingredients, GetDataset('ingredients').ingredients)}
                    </Text></View>
                    <View style={styles.descSkillArea}><Text>
                        방법 : {GetDataset('recipe').skill.find((obj) => obj.id===recipe.skill).name_kr}
                    </Text></View>
                    <View style={styles.descExpArea}><Text>
                        {GetDataset('recipe').recipe.find((obj) => obj.id===props.menu).description}
                    </Text></View>
                </View>
                <CloseButton handler={()=>props.handler(false)} style={styles.closeButton}/>
            </View>
        </>
    )
}


const RecipeList = (props) => {
    const [recipe, SelectRecipe] = useState(undefined);
    var onStyle = {
        height: 40,
        justifyContent: 'center',
        backgroundColor : '#9CC8D5',
    }
    var offStyle = {
        height: 40,
        justifyContent: 'center',
        backgroundColor : '#D6F0F7',
    }

    return (
        <View style={styles.recipeArea}>
            <View style={styles.recipeListArea}>
                <View style={styles.recipeHead}>
                    <Text>
                        test
                    </Text>
                </View>
                <View style={styles.recipeBody}>
                    <ScrollView>
                        {GetDataset('recipe').recipe.map((obj)=>{
                            let componentStyle = recipe===obj.id ? onStyle : offStyle;
                            return (
                                <RecipeComponent key={obj.id} data={obj}
                                switch={()=>{}} selector={(id)=>{
                                    if (id==recipe) { SelectRecipe(undefined) }
                                    else { SelectRecipe(id) }
                                }}
                                style={componentStyle}/>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={styles.recipeTail}>
                    <EditorButton text='취소' handler={()=>props.setVisible(false)}/>
                    <EditorButton text='선택' handler={()=>{
                        props.setVisible(false);
                        AddMenuItem(recipe);
                    }}/>
                </View>
            </View>
            <Pressable 
                onPress= {()=>{
                    props.setVisible(false);
                }}
                style = {styles.popupCloseButton}
            >
                <Text>
                    X
                </Text>
            </Pressable>
        </View>
    )
}


const Board = (props) => {
    const [dummy, Update] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [onEdit, StartEdit] = useState(false);
    const [objSelected, SelectObj] = useState(undefined);

    var closeButton, editButton;
    var body_style = styles.body;
    var editor;
    
    if (onEdit) {
        body_style = styles.body_edit;
        editor = <Editor 
                    selected_id={objSelected} select={SelectObj} 
                    update={()=>Update(!dummy)}
                    exit={()=>{ StartEdit(false) }}
                    onModal={setModalVisible}
                />
    }
    else {
        closeButton = <CloseButton handler={()=>{ props.handler('home') }} style={styles.closeButton}/>
        editButton = <EditButton handler={()=>StartEdit(true)} style={styles.editButton}/>
        editor = undefined;
    }
    var data = GetDataset('menu').menu;
    data.sort((a,b)=>(a.id-b.id));

    return (
        <>
            <View style={props.style.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    }}
                >
                    <RecipeList setVisible={setModalVisible}/>
                </Modal>
                <View style={styles.head}>
                    <Text style={props.style.headText}>
                        Menu
                    </Text>
                    {closeButton}
                    {editButton}
                </View>
                <View style={body_style}>
                    <ScrollView contentContainerStyle={styles.scroll}>
                        {data.map((obj) => (
                            <MenuShort key={obj.id} id={obj.id} style={props.style} recipe_id={obj.recipe_id} 
                            handler={props.ondetail} select={props.menuSelector}
                            editMode={onEdit} selected_id={objSelected} selectObj={SelectObj}/>
                        ))}
                    </ScrollView>
                </View>
                {editor}
            </View>
        </>
      );
}


const MenuBoard = (props) => {
    const [onDetail, ShowDetail] = useState(false);
    const [onEditor, StartEdit] = useState(false);
    const [currentMenu, MenuSelector] = useState(0);

    if(onDetail){
        return <Detail style={props.style} handler={ShowDetail} menu={currentMenu}/>
    }
    else {
        return <Board style={props.style} handler={props.handler} 
                ondetail={ShowDetail} menuSelector={MenuSelector}/>
    }
}


const styles = StyleSheet.create({
    head : {
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'blue',
    },
    body : {
        height: '90%',
        marginTop: 15,
        marginBottom: 15,
        //backgroundColor: 'skyblue',
    },
    body_edit : {
        height: '80%',
        marginTop: 15,
        marginBottom: 15,
        //backgroundColor: 'skyblue',
    },
    tail_edit :{
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#495A5F',
    },
    scroll : {
        height: '100%',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        //backgroundColor: 'orange',//우우우우우 젤리먹게해줘
    },
    scrollComponent : {
        height: '15%',
        width: '95%',
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        //backgroundColor: 'pink',
    },
    scrollComponent_edit : {
        height: '15%',
        width: '95%',
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#525252',
    },
    nameComponent: {
        height: '40%',
        //backgroundColor: 'darkgray',
    },
    subComponent: {
        height: '20%',
        //backgroundColor: 'gray',
    },


    recipeArea : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#D6F0F7',
    },
    recipeListArea : {
        flex : 1,
        width : '95%',
        marginVertical: 20,
        marginHorizontal: 10,
        backgroundColor: '#E3F0F5',
    },
    recipeHead : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#64A8BD',
    },
    recipeBody : {
        flex: 8,
        marginVertical: 15,
        backgroundColor: '#D6F0F7',
    },
    recipeTail :{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#64A8BD',
    },

    popupCloseButton: { 
        position:'absolute', 
        height:25, width:25, 
        right:0, top:0, 
        borderRadius: 12,
        backgroundColor:'#C2D2DC'
    },
    soldoutMark : {
        position: 'absolute',
        left : '25%',
        height: '90%',
        width: '50%',
        resizeMode: 'contain',
        //backgroundColor: 'skyblue',
    },


    closeButton: {
        position: 'absolute',
        top: '20%',
        left: '5%',
        width: '10%',
        height: '80%',
        //backgroundColor: 'white'
    },
    editButton: {
        position: 'absolute',
        top: '20%',
        right: '0%',
        width: '10%',
        height: '80%',
        //backgroundColor: 'white'
    },
    editorButton: {
        height : '80%',
        width : '25%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'skyblue',
    },


    descContainer: {
        width: '90%',
        height: '90%',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#578A63',
    },
    descImg : {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    image : {
        height: '70%',
        width: '50%',
        resizeMode: 'contain',
        //backgroundColor: 'skyblue',
    },
    descName : {
        flex: 1,
        width: '100%',
        //backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    descNameText : {
        fontSize : 15,
        color : 'white',
        fontWeight: 'bold',
    },
    descIngArea : {
        flex : 2,
        width : '100%',
        marginVertical : 5,
        borderRadius : 5,
        backgroundColor: '#79AF86',
    },
    descSkillArea : {
        flex : 1,
        width : '100%',
        marginVertical : 5,
        borderRadius : 5,
        backgroundColor: '#79AF86',
    },
    descExpArea : {
        flex : 6,
        width : '100%',
        marginVertical : 5,
        borderRadius : 5,
        backgroundColor: '#79AF86',
    },
    description : {
        flex: 5,
        width: '90%',
        //backgroundColor: 'yellow',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    descText : {
        
    },
});

export { MenuBoard };



