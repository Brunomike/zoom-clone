const socket = io("/");
let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
let audioPermissions = false;
let videoPermissions = true;

var myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on("stream", function(userVideoStream) {
    console.log("OTHER: " + userVideoStream);
    addVideoStream(video, userVideoStream);
  });
};

navigator.mediaDevices
  .getUserMedia({ audio: audioPermissions, video: videoPermissions })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", function(userVideoStream)  {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("NEW USER WITH ID: " + userId);
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => console.log(err.message));


myPeer.on('open', (id) => {
  socket.emit("join-room", ROOM_ID, id);
});
