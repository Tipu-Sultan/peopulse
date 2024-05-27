import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import Peer from 'simple-peer';
import socket from '../services/socket';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const isLogin = localStorage.getItem("userData");
  const isUser = isLogin ? JSON.parse(isLogin) : null;

  const [callType, setCallType] = useState('')
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on('call-made', (data) => {
      onOpen()
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on('call-answered', (data) => {
      setCallAccepted(true);
      connectionRef.current.signal(data.signal);
    });

    socket.on('call-ended', () => {
      setCallAccepted(false);
      setCallEnded(false);
      setCallerSignal(null);
      setReceivingCall(false);
      setStream(null);
      onClose()
    });

    return () => {
      socket.off('call-made');
      socket.off('call-answered');
      socket.off('call-ended');
    };

  }, [isOpen,onClose, callAccepted, receivingCall, onOpen, callEnded]);


  const callUser = (userToCall) => {
    const username = isUser.username;
    socket.emit('CallToRegisterUser', username);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: userToCall,
        signalData: data,
        from: username,
      });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const declineCall = () => {
    setReceivingCall(false);
  };

  const leaveCall = () => {
    setCallAccepted(false);
    setCallEnded(false);
    setCallerSignal(null);
    setReceivingCall(false);
    setStream(null);
    onClose()
    socket.emit('call-end', { to: caller });
  };

  return (
    <CallContext.Provider
      value={{
        declineCall,
        leaveCall,
        answerCall,
        callUser,
        stream,
        callAccepted,
        myVideo,
        userVideo,
        receivingCall,
        caller,
        callType,
        setCallType,
        isOpen,
        onOpen,
        onClose,
        callEnded,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within an AuthProvider');
  }
  return context;
};
