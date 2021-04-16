import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import './Client.css';
import deleteh3 from '../utils';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

function Client() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [busyUsers, setBusyUsers] = useState({});
  const [calling, setCalling] = useState({});
  const [stream, setStream] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect('http://localhost:8000/clients');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log(stream,"user");
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("temsilciler", (representatives) => {
      setUsers(representatives);
    })
    socket.current.on("mesgulTemsilciler", (data) => {
      setBusyUsers(data);
    })

  }, []);
  
  function callPeer(id) {
    setCalling({id:id,calling:true});
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        <div className="wrap">
          {deleteh3}
          {Object.keys(users).length === 0 ? <h3>Serverda Temsilci Yok</h3>:<span></span>
          }
          {Object.keys(users).map((key,i) => {
              if(!Object.keys(busyUsers).includes(key)){
                if(calling.id == key && calling.calling == true && !callAccepted){
                  return <h3 > Müşteri Temsilcisi {i+1} Aranıyor</h3>
                }
                else if(!callAccepted && !calling.calling){
                  return  <button  className="call_button" onClick={() => callPeer(key)}> Müşteri Temsilcisi {i+1} ie görüşme başlat</button> 
                }
                else if (calling.id == key && callAccepted){
                  return <h3> Müşteri Temsilcisi {i+1} İle Görüşme Başlatıldı </h3>
                }
              }
          })}
          {Object.keys(users).length === Object.keys(busyUsers).length ? <h3>Bütün Temsilciler Görüşmede</h3>:<span></span>}
      </div>
      </Row>
    </Container>
  );
}

export default Client;
