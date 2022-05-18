class Player
{
    constructor()
    {
        this.moveSpeed = 1;
        this.jumpPower = 5;
        this.onGround = true;
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        
		const playerGeometry = new THREE.BoxGeometry();
		const playerMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
		this.model = new THREE.Mesh(playerGeometry, playerMaterial);
    }
    
    update()
    {
        // apply gravity drag and move player
        this.dy -= world.gravity;
        this.dy *= world.drag;
        this.dx *= this.onGround ? world.groundDrag : world.drag;
        this.dz *= this.onGround ? world.groundDrag : world.drag;
        this.model.translateX(this.dx);
        this.model.position.y += this.dy;
        this.model.translateZ(this.dz);
        
        // test ground contact
        if (this.model.position.y <= world.ground)
        {
            this.model.position.y = world.ground;
            this.dy = 0;
            this.onGround = true;
        }
        else
            this.onGround = false;
    }
};