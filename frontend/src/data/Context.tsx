import React, { useState } from "react";

interface ContextType {
    login: boolean,
    setLogin: React.Dispatch<React.SetStateAction<boolean>>,
    useName: string,
    setUseName: any,
    room: string,
    setRoom: any
    open: boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>,
    handleClick: () => void
    senha: any,
    setSenha: React.Dispatch<React.SetStateAction<any>>
}

const ContextProps = React.createContext<ContextType>({} as ContextType)

export const ContextProvider: React.FC = ({ children }) => {

    const [login, setLogin] = useState(false)
    const [useName, setUseName] = useState('')
    const [room, setRoom] = useState('')
    const [open, setOpen] = React.useState(false);
    const [senha, setSenha] = useState('')
    const handleClick = () => {
        setOpen(true);
    };

    return (
        <ContextProps.Provider value={{
            login,
            setLogin,
            useName,
            setUseName,
            room,
            setRoom,
            handleClick,
            open,
            setOpen,
            senha,
            setSenha
        }}>
            {children}
        </ContextProps.Provider>
    )
}

export default ContextProps