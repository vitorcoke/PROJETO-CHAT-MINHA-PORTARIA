type IUsers = {
    id:any, name:any, room:any
}

const users: IUsers[] = []

const addUser = ({ id, name, room }:any) => {
    name = name.trim()
    room = room.trim()
  
    const existingUser = users.find((user) => user.room === room && user.name === name);
  
    if(existingUser) return { error: 'Nome de Usuário já existe!.' };
  
    const user = { id, name, room };
  
    users.push(user);
  
    return {user};
  }
 
const removeUser = (id: any) => {
    const index = users.findIndex((user) => user.id === id )

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id:any) => users.find((user)=> user.id === id)

const getUserInRom = (room:any) => users.filter((user)=> user.room === room) 

export {addUser, removeUser, getUser, getUserInRom} 