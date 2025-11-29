import { useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import AppointmentList from 'react-native-dropdown-picker';






export default function Index() {

  const [Screen, setScreen] = useState<"open" | "home" | "todo" | "appoint" | "event">("open");
 
  const [events, setEvents] = useState([]);
   const [names, setNames]= useState([]);
    const [name, setName]= useState("Add to your list");



if(Screen==="open"){
  return (
  <OpenScreen homeScreen={() => setScreen("home")}/> 
);}

if(Screen==="home"){
  return (
  <Home openScreen= {() => setScreen("open")}
        todoScreen= {() => setScreen("todo")} 
        eventScreen= {() => setScreen("event")}
  /> 
);}

if(Screen==="todo"){
  return (
  <TodoScreen homeScreen={() => setScreen("home")} names={names} name={name} setName={setName}setNames={setNames}/>
);}

if(Screen==="appoint"){
  return <AppointScreen homeScreen={()=> setScreen("home")}/>
}


if (Screen === "event") {
  return <CreateEvent homeScreen={() => setScreen("home")} events={events} setEvents={setEvents}/>
}
return null;


}



function OpenScreen({homeScreen}: {homeScreen: () => void}) { 
return(
<View style={{ width: 400, height: 755, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2,}}>


  <Text style={{fontFamily: "Courier", fontSize: 30, textAlign:"center"}}>
   Plan My Life
    </Text>

    <Text style={{fontFamily: "Courier", fontSize: 25, textAlign:"center",top: 100}}>
     Have all of your appointments and assignments in one place. 
    </Text>

      <Text style={{fontFamily: "Courier", fontSize: 25, textAlign:"center",top: 200}}>
Enjoy our todo list section so you never forget anything.
    </Text>

<View style= {{top: 400, borderWidth: 2, borderColor: "black", width:300, left: 45 }}>
         
        <Button title="Click here to continue" onPress={homeScreen}/>

    </View>


</View>
);
}
//Enjoy our todo list section so you never forget anything.





function Home({openScreen, todoScreen, eventScreen}: {openScreen: () => void; todoScreen:() => void; eventScreen: ()=> void} ){
 
  return(
    <View style={{width: 400, height: 760, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2}}>

      <Text style={{fontSize: 30, top: 60, alignSelf:"center"}}>
        HomeScreen
      </Text>

      <View style={{top: -10, borderColor: "black", borderWidth: 2, width: 70}}>
        <Button title="<--" onPress={openScreen}/>
      </View>

      <View style={{bottom: -503, width: 100, left: 285, borderWidth:2, borderColor:"black"}}>
        <Button title="Todo List" onPress={todoScreen}/>
      </View>

      <View style={{bottom: -430, width: 200, left: 5, borderWidth:2, borderColor:"black"}}>
        <Button title="Appointments/Assignments" onPress={eventScreen}/>
      </View>

    </View>
  );
}








function TodoScreen({homeScreen, names, setNames,name,setName}:{homeScreen: ()=> void; names:any[]; setNames:any; name:any; setName:any}){

 const addList = ()=> {
  setNames([...names, name]);
  setName("");

 };
  return(
    <View>

<View style={{top: -1 , borderWidth: 2, borderColor: "black", width:80,right:-10}}>
        <Button title="<--" onPress={homeScreen}/>
</View>

<TextInput placeholder="Add to your list" value={name} onChangeText={setName} style={{borderColor:"black", borderWidth: 2, alignSelf:"center", width:400, padding: 15, marginVertical: 10}}/>

<Button title="Add" onPress={addList}/>

<FlatList
        data={names}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 2, borderColor: 'blue', padding: 15, borderRadius: 8, alignSelf:"center", width:400,marginVertical: 10, height:100 }}>

            <Text style={{fontSize:18}}>{item}</Text>

          <View style={{width: 100, borderColor:"red", borderWidth:2 }}>
          <Button title="Delete" onPress={ () => setNames(names.filter((n: { title: any; }) => n.title !== item.names))}/>
          </View>

          <View style={{width: 150, borderColor:"green", borderWidth:2, right: -185, bottom:48, }}>
          <Button title="Delete" onPress={ () => setNames(names.filter((n: { title: any; }) => n.title !== item.names))}/>
          </View>
          
          </View>
        )}
      />

      

    </View>
    
  );
}





function AppointScreen({homeScreen}: {homeScreen: ()=> void}){
  
  return(
    <View>

<View style={{borderColor: "black", borderWidth: 2, width: 70}}>
  <Button title="<--" onPress={homeScreen} />
</View>



    </View>
  );
}

 








function CreateEvent({ homeScreen, events, setEvents }: {homeScreen: ()=> void; events: any[]; setEvents: any}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

const [priority, setPriority] = useState(null);

const [open, setOpen] = useState(false);
const [items, setItems] = useState([
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },

  
]);



type EventType = {
  title: string;
  date: string;
  notes: string;
  priority: string | null;
};

  const handleSave = () => {
    if (!title || !date) {
      Alert.alert("ERROR", "Title and Date are required!");
      return;
    }

    console.log("New Event Created:", { title, date, notes });

    const newEvent = {title,date,notes,priority,};

    setEvents([...events, newEvent]);

    setTitle("");
    setDate("");
    setNotes("");
    setPriority(null);
  };



  return (
    <View
      style={{width: 400,height: 760,alignSelf: "center",borderWidth: 2, borderColor: "black",backgroundColor: "white", padding: 20,}}>
        
    <Text
    style={{fontSize: 24,textAlign: "center",marginBottom: 10, marginTop:40}}>
        Appointments/Assignments
    </Text>

      <Text style={{ fontSize: 18 }}>Name</Text>
      <TextInput placeholder="Enter event name"value={title} onChangeText={setTitle}
        style={{borderWidth: 1,borderColor: "gray",padding: 10, marginBottom: 20, }} />

      <Text style={{ fontSize: 18 }}>Due Date</Text>
      <TextInput placeholder="MM-DD-YYYY"value={date} onChangeText={setDate}
        style={{borderWidth: 1, borderColor: "gray",padding: 10,marginBottom: 20, }}/>

<Text style={{ fontSize: 18 }}>Priority</Text>

<AppointmentList placeholder="Choose priority" open={open} value={priority} items={items} setOpen={setOpen} setValue={setPriority} setItems={setItems} style={{ borderRadius: 10, marginBottom: 20 }}/>

  <Button title="Add" onPress={handleSave} />


<FlatList
        data={events}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{borderWidth: 1,borderColor: "blue", padding: 10, marginVertical: 5,borderRadius: 8}}>
            <Text>Title: {item.title}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Priority: {item.priority}</Text>
          
          <View style={{width: 100, borderColor:"red", borderWidth:2 }}>
          <Button title="Delete" onPress={ () => setEvents(events.filter(e => e.title !== item.title))}/>
          </View>

          <View style={{width: 150, borderColor:"green", borderWidth:2, right: -185, bottom:48}}>
          <Button title="Completed" onPress={ () => setEvents(events.filter(e => e.title !== item.title))}/>
          </View>

          </View>
        )}
        style={{ marginTop: 20 }}
      />

<View style={{borderColor: "black", borderWidth: 2, width: 70, bottom:675}}>
  <Button title="<--" onPress={homeScreen} />
</View>

    </View>

    
  );
}

