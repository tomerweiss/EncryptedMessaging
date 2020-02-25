import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { Context as UserContext } from '../context/UserContext';
import { Feather } from '@expo/vector-icons';
import Dialog from "react-native-dialog";

const UserListScreen = ({ navigation }) => {
   const { state, fetchUsers, deleteUser, messageUser} = useContext(UserContext);
   const [isVis, setVisible] = useState(false);
   const [userId, setUserId] = useState();
   const [messageText, setMessageText] = useState();

   useEffect(() => {
      fetchUsers();
      const listener = navigation.addListener('didFocus', () => {
         fetchUsers();
      })
      return () => {
         listener.remove();
      }
   }, [])



   return <>
      <FlatList
         data={state}
         keyExtractor={item => item.id}
         renderItem={({ item }) => {
            return (
               <TouchableOpacity onPress={() =>
                  navigation.navigate('UserDetail', { _id: item.id })
               }
               >
                  <View style={styles.row}>
                     <Text style={styles.title}>{item.id}</Text>
                     {/* <TouchableOpacity onPress={() => messageUser(item.userId, 'bla')}>
                              <Feather style={styles.icon} name="mail"/>
                           </TouchableOpacity> */}
                     <TouchableOpacity onPress={() => {
                        setVisible(true)
                        setUserId(item.id)
                        }}>
                        <Feather style={styles.icon} name="mail" />
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {
                        deleteUser(item.id)
                        fetchUsers()
                     }}>
                        <Feather style={styles.icon} name="trash" />
                     </TouchableOpacity>         
                  </View>
               </TouchableOpacity>
               
            )
         }}
      />
      <Dialog.Container visible={isVis}>
          <Dialog.Title>Message</Dialog.Title>
          <Dialog.Input  value={messageText} onChangeText={setMessageText} placeholder="Enter text here"></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={()=>{setVisible(false)}}/>
          <Dialog.Button label="Send" onPress={()=>{
             messageUser(userId, messageText)
             setVisible(false)
             setMessageText('');
             }}/>
        </Dialog.Container>
   </>
}

UserListScreen.navigationOptions = ({ navigation }) => {
   return {
      title: 'Users',
      headerRight:
         <TouchableOpacity onPress={() => navigation.navigate('UserCreate')}>
            <Feather name="plus" size={30} />
         </TouchableOpacity>
   }
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderColor: 'grey'
   },
   title: {
      fontSize: 18
   },
   icon: {
      fontSize: 24
   },
   message: {
      
   }
});

export default UserListScreen;