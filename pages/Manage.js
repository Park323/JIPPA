import React, 
{ Component, 
  useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  Alert,
} from 'react-native';
import IMG_logo from '../assets/src/img/logo.png';
import { 
    CloseButton, CheckBox,
    CheckRecipeAvailable, CheckIngExist,
} from '../utils/utils';
import { GetDataset, SetData, SwitchExist } from '../utils/async';


const Tab = (props) => {
    if (props.name===props.current){
        var tabStyle = styles.onTab;
    }
    else {
        var tabStyle = styles.offTab;
    }
    return (
        <Pressable 
            style={tabStyle}
            onPress={()=>{props.handler(props.name)}}
        >
            <Text>
                {props.name}
            </Text>
        </Pressable>
    );
}


const DetailSetting = (props) => {
    var recipe = GetDataset('recipe').recipe.find((obj) => obj.id===props.id)
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
                    <Text>
                        {recipe.name_kr}
                    </Text>
                </View>
                <View style={styles.description}>
                    <View style={styles.descIngArea}><Text>
                        재료 : {recipe.ingredients}
                    </Text></View>
                    <View style={styles.descSkillArea}><Text>
                        방법 : {GetDataset('recipe').skill.find((obj) => obj.id===recipe.skill).name_kr}
                    </Text></View>
                    <View style={styles.descExpArea}><Text>
                        {GetDataset('recipe').recipe.find((obj) => obj.id===recipe.id).description}
                    </Text></View>
                </View>
                <CloseButton handler={()=>props.handler(false)} style={styles.closeDetail}/>
            </View>
        </>
    )
}


// RECIPE
const RecipeComponent = (props) => {
    if (props.style) {
        var style = props.style
    } else { var style = styles.subCategory }
    return (
        <>
            <Pressable 
            style={style}
            onPress={()=>{
                props.switch();
                props.selector(props.data.id);
            }}>
                <View style={styles.component}>
                    <Text style={props.textStyle}>
                        {props.data.name_kr}
                    </Text>
                </View>
            </Pressable>
        </>
    )
}


const RecipeCategory = (props) => {
    return (
        <>
            <Text style={styles.categoryTitle}>
                Recipe
            </Text>
            <View style={styles.subCategoryArea}>
                {props.data.map((obj)=>(
                    <RecipeComponent key={obj.id} data={obj}
                    switch={()=>props.switch(true)} selector={props.selector}
                    textStyle={styles.nameText}/>
                ))}
            </View>
        </>
    )
}


const RecipeList = (props) => {
    return (
        <View style={styles.contents}>
            <ScrollView
            contentContainerStyle={styles.scroll}>
                <RecipeCategory 
                style={props.style} key={0} data={GetDataset("recipe").recipe}
                switch={props.switch} selector={props.selector}/>
            </ScrollView>
        </View>
    );
}


const RecipeTab = (props) => {
    const [onDetail, SwitchDetail] = useState(false);
    const [recipeID, SetID] = useState(0);

    if (onDetail){
        return <DetailSetting style={props.style} id={recipeID} handler={SwitchDetail}/>
    }
    else {
        return <RecipeList style={props.style} switch={SwitchDetail} selector={SetID}/>
    }
}



// STORAGE
const IngComponent = (props) => {
    var ing_id = [props.parent, props.data.id].join('-');
    const [on, SwitchOn] = useState(CheckIngExist(ing_id));

    return (
        <>
            <View style={styles.subCategory}>
                <View style={styles.component}>
                    <Text style={styles.nameText}>
                        {props.data.name_kr}
                    </Text>
                    <CheckBox on={on} style={styles.checkBox}
                    handler={()=>{
                        SwitchExist(ing_id);
                        SwitchOn(CheckIngExist(ing_id));
                    }}/>
                </View>
            </View>
        </>
    )
}


const IngCategory = (props) => {
    return (
        <>
            <Text style={styles.categoryTitle}>
                {props.data.name}
            </Text>
            <View style={styles.subCategoryArea}>
                {props.data.children.map((obj)=>(
                    <IngComponent key={obj.id} 
                    data={obj} style={props.style}
                    parent={props.data.id}/>
                ))}
            </View>
            <View style={props.style.seperator}/>
        </>
    )
}


const StorageTab = (props) => {
    return (
        <View style={styles.contents}>
            <ScrollView
                contentContainerStyle={styles.scroll}>
                    {GetDataset('ingredients').ingredients.map((obj)=>(
                        <IngCategory style={props.style} key={obj.id} data={obj}/>)
                    )}
            </ScrollView>
        </View>
    );
}


const Manager = (props) => {
    const [currentTab, SetTab] = useState('Recipe');

    let viewPage;
    if (currentTab==='Recipe'){
        viewPage = <RecipeTab style={props.style}/>
    }
    else if (currentTab==='Storage'){
        viewPage = <StorageTab style={props.style}/>
    }

    return (
        <>
            <View style={{height:'100%', width:'100%'}}>
                <View style={styles.tabMenu}>
                    <CloseButton handler={()=>props.handler("home")} style={styles.closeButton}/>
                    <Tab name="Recipe" handler={SetTab} current={currentTab}/>
                    <Tab name="Storage" handler={SetTab} current={currentTab}/>
                </View>
                <View style={styles.board}>
                    {viewPage}
                </View>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    tabMenu : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '444444',
    },
    onTab: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2C',
    },
    offTab: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#444444',
    },
    // Contents
    board : {
        flex: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2C',        
    },
    contents : {
        width: '100%',
        height: '100%',
        //backgroundColor: 'blue',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    scroll : {
        height: '100%',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        //backgroundColor: 'orange',
    },
    categoryTitle : {
        fontSize : 20,
        color : '#BD2448',
        fontStyle : 'italic',
        //backgroundColor: 'pink',
    },
    subCategoryArea: {
        marginLeft : 15,
        //backgroundColor: 'gray',
    },
    subCategory: {
        height: 40,
        marginVertical: 10,
        justifyContent: 'center',
        borderRadius : 5,
        backgroundColor: '#463B3E',
    },
    component: {
        height: '90%',
        width: '100%',
        flexDirection: 'row',
        //backgroundColor: 'yellow',
    },

    descContainer: {
        width: '90%',
        height: '90%',
        alignItems: 'center',
        //backgroundColor: 'blue',
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
        borderRadius: '10',
        backgroundColor: 'skyblue',
    },
    descName : {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'green',
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        //backgroundColor: 'yellow',
    },
    descText : {
        
    },

    closeButton: {
        width: '10%',
        backgroundColor: '#444444'
    },
    closeDetail: {
        width: '20%',
        //backgroundColor: 'white'
    },
    checkBox: {
        flex:1, 
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#C1B8BA'
    },

    nameText: {marginLeft:10, fontSize:20, color:'white', flex:9}
});

export { Manager, RecipeComponent };