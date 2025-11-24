import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";

export default function Index() {

  const [Screen, setScreen] = useState<"open" | "home">("open");
 

if(Screen==="open"){
  return <OpenScreen homeScreen={() => setScreen("home")}/> 
}
if(Screen==="home"){
  return <Home openScreen= {() => setScreen("open")} />
}
}




function OpenScreen({homeScreen}: {homeScreen: () => void}) {
return(
<View style={{ width: 400, height: 755, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2,}}>


  <Text style={{fontFamily: "Courier", fontSize: 30, textAlign:"center"}}>
   Welcome to Plan my Life!
    </Text>
    <Text style={{fontFamily: "Courier", fontSize: 25, textAlign:"center",top: 100}}>
      Before continuing would you like to upload something makes you happy and something that makes you sad?
    </Text>

<View style= {{bottom: 2}}>
  <ContinueButton Screen={homeScreen}/>
</View>

<YesButton/>

<NoButton/>

</View>
);
}

function Home({openScreen}: {openScreen: () => void}){
 
  return(
    <View style={{width: 400, height: 760, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2}}>
      <Text style={{fontSize: 20}}>
        This can be the screen where we add the scheduler or maybe the calender.
        I think we should all make branches and play with the code.
        We can also have different pages for everything
      </Text>

      <View style={{bottom: -550}}>
        <Button title="Go Back" onPress={openScreen}/>
      </View>

    </View>
  );
}




function No(){  
  Alert.alert("Oh... hmmm... Nothing makes you happy huh?");
  console.log("No button pressed");
}
function Yes(){  
  Alert.alert("Great Upload it now");
  console.log("Yes button pressed");
}

function YesButton(){
  return(
<View style= {{width: 70, height: 50, margin: -60, backgroundColor: "white", borderColor:"black", borderWidth:2, top: 290, left: 120,}}>

  <Button title="YES" onPress={Yes}/>

</View>
  );
}

function NoButton(){
  return(
<View style= {{width: 70, height: 50, backgroundColor: "white", borderColor:"black", borderWidth: 2, top: 300, right: 60, alignSelf: "flex-end"}}>

  <Button title="NO" onPress={No}/>

</View>
  );
}

function ContinueButton({Screen}: {Screen: () => void}){
  return(
    <View style= {{top: 400, borderWidth: 2, borderColor: "black", width:300, left: 45 }}>
      
        <Button title="Click here to continue" onPress={Screen}/>

    </View>

  );
}

type CreateEventProps = {
    goHome: () => void;
};
export function CreateEvent({goHome}: CreateEventProps){
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const handleSave = () => {
        if (!title || !date){
            Alert.alert("ERROR", "Title and Date are required!");
            return;
        }
        
        console.log("New Event Created:", {title,date, notes});
        goHome();
    };
    return(
           <View
           style={{
               width: 400, height: 760, alignSelf: "center", borderWidth: 2, borderColor: "black", backgroundColor: "white", padding: 20
           }}>
           <Text style={{
               fontSize: 28, textAlign: "center", marginBottom: 20
           }}>
           Create New Event
           </Text>
           <Text style={{ fontSize: 18
           }}>Event Title</Text</Text>
           <TextInput
            placeholder = "Enter event name"
            value = {title}
            onChangeText = {setTitle}
           style = {{ borderWidth: 1, borderColor; "gray", padding: 10, marginBottom: 20
           }}
           />
           
           <Text style = {{fontSize: 18
           }}>Date</Text>
           <TextInput
            placeholder = "MM-DD-YYYY"
           value = {date}
           onChangeText = {setDate}
           style = {{
               borderWidth: 1, borderColor: "gray", padding: 10, marginBottom: 20
           }}
           />
           
           <Text style = {{ fontSize: 18
           }}>Notes (optional)</Text>
           <TextInput
            placeholder = "Description"
           value = {notes}
           onChangeText = {setNotes}
           multiline
           
           style = {{
               borderWidth: 1, borderColor: "gray", padding: 10, height: 100, textAlignVertical: "top", marginBottom: 30
           }}
           />
           
           <Button title = "Add Event" onPress = {handleSave} />
           <View style = {{ marginTop: 20
           }}>
           Button title = "Cancel" onPress = {goHome} />
           </View>
           </View>
           );
}
