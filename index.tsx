import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, Button, Text, View } from "react-native";

const Stack= createNativeStackNavigator();

export default function Index() {
  return (
<View>

<OpenScreen /> 
<YesButton />
<NoButton />
<ContinueButton/>

</View>
);}

function OpenScreen() {
return(
<View style={{ width: 400, height: 700, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2,}}>

<View>
  <Text style={{fontFamily: "Courier", fontSize: 30, textAlign:"center"}}>
   Welcome to Plan my Life!
    </Text>
    <Text style={{fontFamily: "Courier", fontSize: 25, textAlign:"center",top: 100}}>
      Before continuing would you like to upload something makes you happy and something that makes you sad?
    </Text>
</View>

</View>
);
}

function No(){  
  Alert.alert("Oh... hmmm... Nothing makes you happy huh?");
  console.log("No button pressed");
}
function Yes(){  
  Alert.alert("Yay. Nice pic!!!!");
  console.log("Yes button pressed");
}

function YesButton(){
  return(
<View style= {{width: 70, height: 50, margin: -60, backgroundColor: "white", borderColor:"blue", borderWidth:2, bottom: 60, left: 120,}}>

  <Button title="YES" onPress={Yes}/>

</View>
  );
}

function NoButton(){
  return(
<View style= {{width: 70, height: 50, backgroundColor: "white", borderColor:"blue", borderWidth: 2, bottom: 50, right: 60, alignSelf: "flex-end"}}>

  <Button title="NO" onPress={No}/>

</View>
  );
}

/*function Continue(){
  return(
    <View style={{width: 400, height: 700, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2}}>
      <Text>
        Practice screen
      </Text>
    </View>
  );
}*/

function ContinueButton(){
  return(
  <View style={{width: 400, height: 60, backgroundColor: "white", borderColor:"black", borderWidth: 2, alignSelf:"center"}}>

  <Button title="Click here to continue" />

  </View>
  );
}