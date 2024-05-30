import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Text,
    Box,
    Button,
} from "@chakra-ui/react";
import { useCall } from "../context/CallContext";

const AudioVideoCall = ({
    isOpen,
    onClose,
    selectedUser,
}) => {

    const {
        callType,
        stream,
        callAccepted,
        myVideo,
        userVideo,
        caller,
        answerCall,
        declineCall,
        leaveCall,
        receivingCall,
        isUser,
        callEnded,
        callDuration,
        formatTime
    } = useCall();
    return (
        <Modal isOpen={isOpen && !callEnded} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{callType === "video" ? "Video" : "Audio"} Call</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Text>Calling {selectedUser?.firstname + ' ' + selectedUser?.lastname}</Text>
                    </Box>
                    <Box>
                        {(callType === "video" || callType === "audio") && stream && (
                            <>
                                <Text>{isUser?.firstname}</Text>
                                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                            </>
                        )}
                    </Box>
                    <Box>
                        <Text>{selectedUser?.firstname} <h2>Call Duration: {formatTime(callDuration)}</h2></Text>
                        {(callType === "video" || callType === "audio") && callAccepted && (
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                        )}
                    </Box>
                    {!callAccepted && receivingCall && (
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Incoming Call</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text>{caller} is calling...</Text>
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme="green" mr={3} onClick={answerCall}>
                                        Answer
                                    </Button>
                                    <Button colorScheme="red" onClick={declineCall}>Decline</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    )}
                    {callAccepted && (
                        <Button onClick={leaveCall}>Hang Up</Button>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AudioVideoCall;
