class NetworkedObject extends THREE.Object3D
{
    construct(id, position)
    {
        this.id = id;
        this.position = position;
    }
}

const players = new Map();

/*
Socket instructions. In the future, I would like to improve this with a real event based system.
1 = Assigns this script instance to a client.
    Format: 1:clientID:positionX;positionY;positionZ
2 = A new client has joined. Ignore if clientID is this client.
    Format: 2:clientID:positionX;positionY;positionZ
3 = A client has moved. Ignore if clientID is this client.
    Format: 3:clientID:positionX;positionY;positionZ
*/

var clientId = -1;

var socket = new WebSocket("ws://localhost:8887");

socket.onopen = function(e) 
{
    console.log("Connected to server.");
    
    animate();
}

socket.onclose = function(e) 
{
    console.log("Disconnected from server.");
}

socket.onmessage = function(e)
{
    const message = e.data.split(':');

    switch (message[0])
    {
        case "1": // Give us our player information.
        {
            clientId = message[1];
            let position = message[2].split(';');
            console.log(position);
            console.log(player);
            break;
        }
        case "2": // New player
        {
            if (message[1] == clientId)
                break;
                
            console.log("A new player joined the game.");
            
            const newPlayer = new Player();
            const position = message[2].split(";");
            newPlayer.model.position.x = position[0];
            newPlayer.model.position.y = position[1];
            newPlayer.model.position.z = position[2];
            scene.add(newPlayer.model);
            
            players.set(message[1], newPlayer);
            
            break;
        }
        case "3": // A player changed their position
        {
            if (message[1] == clientId)
                break;
            else if (message[1] == -1)
                break;

            const player = players.get(message[1]);
            const position = message[2].split(';');
            
            player.model.position.x = position[0];
            player.model.position.y = position[1];
            player.model.position.z = position[2];

            break;
        }
        default:
            console.error("Invalid command received from server.");
            break;
    }
}

socket.onerror = function(e) 
{
    console.error("There was an error.");
}

function sendMovementPosition(position)
{
    socket.send("3:" + clientId + ":" + position.x + ";" + position.y + ";" + position.z);
}