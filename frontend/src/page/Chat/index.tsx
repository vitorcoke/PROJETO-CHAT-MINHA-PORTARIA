/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Avatar, Button, ListItem, ListItemIcon, Paper, TextField } from '@material-ui/core';
import queryString from 'query-string'
import { io, Socket } from "socket.io-client";
import ReactScroll from 'react-scrollable-feed'

var socket: Socket
const server = 'http://192.168.103.180:8081'

type IMessegens = { user: any, text: any, time: any }

type UserRoom = { user: [{ id: any, name: any, room: any }] }

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,

    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(0.5),

    },
    form: {
        padding: '10px',
    },
    buttonAppBar: {
        marginLeft: '50px',
        backgroundColor: '#000',
        color: '#fff',
        "&:hover": {
            backgroundColor: '#000'
        }

    },
    Clinete: {
        display: 'flex',
        justifyContent: 'flex-end'

    },
    childreCliente: {
        backgroundColor: '#b82525',
        float: 'right',
        borderRadius: '10px 0 10px 10px',
        borderTop: '10px solid #b82525',
        borderRight: '10px solid transparent',
        backgroundClip: 'padding-box',
        padding: '0 10px 10px 10px',
        color: 'white',
        fontWeight: 'lighter',
        maxWidth: '400px',
        overflowWrap: 'break-word'
    },
    Server: {
        display: 'flex',
        marginLeft: '10px',
        marginTop: '8px'

    },
    childreServer: {
        backgroundColor: '#37e680',
        float: 'left',
        borderRadius: '0 10px 10px 10px',
        borderTop: '10px solid #37e680',
        borderLeft: '10px solid transparent',
        backgroundClip: 'padding-box',
        padding: '0 10px 10px 10px',
        maxWidth: '400px',
        overflowWrap: 'break-word'
    },
    scrollBar: {
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',

        },
        height: '66vh',
        paddingRight: '20px'
    },
    logo: {
        display: 'flex',
        justifyContent: 'center',
        width: '200px',
        height: '60px',
        margin: '15px',
    },
    timeCliente: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '-3px',
        paddingRight: '10px'
    },
    timeServer: {
        display: 'flex',
        marginTop: '-2px',
        marginLeft: '20px'
    }
}));



const Chat: React.FC = () => {
    const classes = useStyles();

    const [nameParse, setNameParse] = useState('')
    const [roomParse, setRoomParse] = useState('')
    const [messagen, setMessagen] = useState('')
    const [messagensList, setMessagensList] = useState<IMessegens[]>([])
    const [userRoom, setUserRoom] = useState<UserRoom[]>([])

    useEffect(() => {
        const { room, name }: any = queryString.parse(location.search);
        setRoomParse(room)
        setNameParse(name)

        socket = io(server)

        socket.emit('join', { name, room }, () => {

        })

        socket.on('error', (error) => {
            alert(error)
        })

        socket.on('getUser', (data) => {
            const users = data.user.map((m: { name: any; }) => m.name)
            setUserRoom(users)
        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }

    }, [server, location.search])


    useEffect(() => {
        socket.on('message', data => {
            setMessagensList((list) => [...list, data])
        })

    }, [])

    // function notify(name: any ,message: string | any) {
    //     if (!("Notification" in window)) {
    //         alert("This browser does not support system notifications");
    //     }
    //     else if (Notification.permission === "granted") {
    //         if (typeof message === 'string') {
    //             var notification = new Notification(`${name}: ${message}`);
    //         } else {
    //             var notification = new Notification("Hello World");
    //         }
    //     }
    //     else if (Notification.permission !== 'denied') {
    //         Notification.requestPermission(function (permission) {
    //             if (permission === "granted") {
    //                 var notification = new Notification("Hello World");
    //             }
    //         });
    //     }
    // }


    function Time() {
        function pad(s: string | number) {
            return (s < 10) ? '0' + s : s;
        }
        var date = new Date();
        return [date.getHours(), date.getMinutes()].map(pad).join(':');
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (messagen.trim()) {
            const message = {
                user: nameParse,
                text: messagen,

                time: Time()
            }
            socket.emit('sendMessage', message)
            // notify(nameParse,messagen)
            setMessagen('')
        }

    }


    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: '#b82525' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap>
                        Chat Minha Portaria
                    </Typography>
                    <Typography variant="body1" >
                        Conectado na Sala:  <b>{roomParse}</b>
                        <Button href='/' className={classes.buttonAppBar}> Sair</Button>
                    </Typography>

                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.logo}>
                    <img src="https://minhaportaria.com/wp-content/uploads/2021/01/logo-footer-203120.png" />
                </div>
                <Divider />
                <List>
                    {userRoom.map((m, i) => (
                        <ListItem key={i} button>
                            <ListItemIcon>
                                <Avatar></Avatar>
                            </ListItemIcon>
                            <Typography style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px' }}>{m}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Paper
                        variant='outlined'
                        style={{ height: '70vh', padding: '20px 0 20px 0px' }}
                        className={classes.scrollBar}
                    >
                        <ReactScroll
                            className={classes.scrollBar}>
                            {messagensList.map((m, i) => (m.user === nameParse ? (
                                <>
                                    <div key={i} className={classes.Clinete}>
                                        <div className={classes.childreCliente}>
                                            <span>{m.text}</span>
                                        </div>
                                    </div>
                                    <div className={classes.timeCliente}>
                                        <p>{m.time}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div key={i} className={classes.Server}>
                                        <div className={classes.childreServer}>
                                            <span>{m.text}</span>
                                        </div>
                                    </div>
                                    <div className={classes.timeServer}>
                                        <p style={{
                                            fontStyle: 'oblique',
                                            fontWeight: 'bold',
                                            marginRight: '8px'
                                        }
                                        }>
                                            {m.user}</p>
                                        <p>{m.time}</p>
                                    </div>
                                </>
                            )

                            ))}
                        </ReactScroll>

                    </Paper>

                    <TextField style={{ paddingTop: '20px' }}
                        placeholder="Mensagem"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        spellCheck={true}
                        onChange={e => setMessagen(e.target.value)}
                        value={messagen}
                    />
                </form>

            </main>
        </div>
    );
}

export default Chat