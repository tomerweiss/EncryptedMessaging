import React, { useContext} from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo } from '@expo/vector-icons';
import Spacer from '../components/Spacer';


const UserMessagesScreen = ({ navigation }) => {
   const { state, fetchMessages} = useContext(MessageContext);

   return <>
      <NavigationEvents onWillFocus={fetchMessages}/>
      <Spacer/>
      <Text style={{ fontSize: 48 }}>Messages</Text>


      <Spacer />
      <FlatList
         data={state}
         keyExtractor={item => item.id}
         style={{ flexGrow: 1 }}
         renderItem={({ item }) => {
            return (
               <>
                  <Spacer />
                  <Text>Sender ID:</Text>
                  <Text>{item.senderid}</Text>
                  <TouchableOpacity style={styles.row} onPress={() => alert(item.decMsg)}>
                     <Text>Open Message -></Text>
                  </TouchableOpacity>
               </>
            )
         }}
      />
   </>
}

UserMessagesScreen.navigationOptions = {
   title: 'Messages',
   tabBarIcon: <Entypo name="mail" size={20} />
}
const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: 'grey'
   },
   title: {
      fontSize: 18
   },
   icon: {
      fontSize: 24
   }
});

export default UserMessagesScreen;