import { useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import AppointmentList from 'react-native-dropdown-picker';

export default function Index() {

  const [Screen, setScreen] = useState<"open" | "home" | "todo" | "appoint">("open");
 
if(Screen==="open"){
  return (
  <OpenScreen homeScreen={() => setScreen("home")}/> 
);}

if(Screen==="home"){
  return (
  <Home openScreen= {() => setScreen("open")}
        todoScreen= {() => setScreen("todo")} 
        appointScreen= {() => setScreen("appoint")}
  /> 
);}

if(Screen==="todo"){
  return (
  <TodoScreen homeScreen={() => setScreen("home")} />
);}

if(Screen==="appoint"){
  return <AppointScreen homeScreen={()=> setScreen("home")}/>
}
return null;
}


function OpenScreen({homeScreen}: {homeScreen: () => void}) {
  
return(
<View style={{ width: 400, height: 755, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2,}}>


  <Text style={{fontFamily: "Courier", fontSize: 30, textAlign:"center"}}>
   *App Name
    </Text>
    <Text style={{fontFamily: "Courier", fontSize: 25, textAlign:"center",top: 100}}>
      Before continuing would you like to upload something makes you happy and something that makes you sad?
    </Text>

<View style= {{top: 400, borderWidth: 2, borderColor: "black", width:300, left: 45 }}>
        <Button title="Click here to continue" onPress={homeScreen}/>

    </View>

<YesButton/>

<NoButton/>

</View>
);
}

function Home({openScreen, todoScreen, appointScreen}: {openScreen: () => void; todoScreen:() => void; appointScreen: ()=> void} ){
 
  return(
    <View style={{width: 400, height: 760, alignSelf: "center", borderColor: "black", backgroundColor: "grrey", borderWidth: 2}}>

      <Text style={{fontSize: 20, top: 60, alignSelf:"center"}}>
        HomeScreen
      </Text>

      <View style={{top: -10, borderColor: "black", borderWidth: 2, width: 70}}>
        <Button title="<--" onPress={openScreen}/>
      </View>

      <View style={{bottom: -498, width: 100, left: 255}}>
        <Button title="Todo List" onPress={todoScreen}/>
      </View>

      <View style={{bottom: -430, width: 200, left: 5}}>
        <Button title="Appointments/Assignments" onPress={appointScreen}/>
      </View>

    </View>
  );
}

function TodoScreen({homeScreen}:{homeScreen: ()=> void}){

 const [name, setName]= useState("Add to your list");
 const [names, setNames]= useState<string[]>([]);

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
          <View style={{ borderWidth: 2, borderColor: 'blue', padding: 15, borderRadius: 8, alignSelf:"center", width:400,marginVertical: 10 }}>
            <Text>{item}</Text>
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


<Appointbutton/>

    </View>
  );
}

 


function No(){  
  Alert.alert("Oh... hmmm... Nothing makes you happy huh?");
  console.log("No button pressed");
}
function Yes(){  
  Alert.alert("Great Upload it now ");
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


type Appointment = {
  id: string;
  name: string;
  priority: string | null;
};
function Appointbutton(){
  const [name, setName] = useState('Add to your list');
  const [priority, setPriority] = useState(null);
  const [duedate, setDuedate]= useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]); 

 const addAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      name,
      priority,
    };
    setAppointments([...appointments, newAppointment]);
    setName('Enter your new appointment');
    setPriority(null);
  };

  return (
    <View style={{ padding: 10 }}>
     <TextInput placeholder="Add to your list" value={name} onChangeText={setName} style={{borderColor:"black", borderWidth: 2, alignSelf:"center", width:400, padding: 15, marginVertical:10}}/>


      <AppointmentList
        placeholder="Select priority"
        open={open}
        value={priority}
        items={items}
        setOpen={setOpen}
        setValue={setPriority}
        setItems={setItems}
        style={{ borderRadius: 10, marginBottom: 10 }}
      />

      <Button title="Add Appointment" onPress={addAppointment} />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        Appointments
      </Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{borderWidth: 1, borderColor: 'blue', padding: 10, marginVertical: 5, borderRadius: 8}}>

            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text>Priority: {item.priority}</Text>

          </View>
        )}
      />
    </View>
  );
}

