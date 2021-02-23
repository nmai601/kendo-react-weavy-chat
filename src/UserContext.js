import { createContext } from 'react'

const UserContext = createContext({
  user: null,  
  login: () => null,
  logout: () => null
})

export default UserContext