const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 1.5708);

scene.add(floor);

var mouse = new THREE.Vector2();

var prevMouseX = 0;
var prevMouseY = 0;

function onMouseMove(event)
{
    event.preventDefault();
    
    if (event.movementX < 0)
        // rotate character left
        player.model.rotation.y += 0.02;
    else if (event.movementX > 0)
        // rotate character right
        player.model.rotation.y -= 0.02;
        
    if (event.movementY < 0)
        camera.rotation.x += 0.015;
    else if (event.movementY > 0)
        camera.rotation.x -= 0.015;
    
    return;
}

window.addEventListener('mousemove', onMouseMove);

window.addEventListener('resize', function(event)
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();
})

const world = new World();

const player = new Player();
player.model.position.z = 0;
camera.position.y = 2;
player.model.attach(camera);
scene.add(player.model);

const animate = function()
{
    if (paused)
    {
        $("#blocker").show();
        paused = true;
        console.log("Exiting gameplay loop, game is paused.");
        return;
    }

	requestAnimationFrame(animate);
	
    // react to keyboard state
    if (keys["Space"] && player.onGround) { player.dy = player.jumpPower }
    if (keys["KeyA"]) { player.dx = -player.moveSpeed }
    if (keys["KeyD"]) { player.dx = player.moveSpeed }
    if (keys["KeyW"]) { player.dz = -player.moveSpeed }
    if (keys["KeyS"]) { player.dz = player.moveSpeed }
    
    player.update();
    
    sendMovementPosition(player.model.position);
    
	renderer.render(scene, camera);
};