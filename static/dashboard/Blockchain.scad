$fn = 50;

// Basic block builder
module block(pos=[0,0,0], size=[40,20,10], label="") {
    translate(pos)
    cube(size, center=true);
}

// Layers (Z axis = system depth)

// Identity Layer
block([0,0,40], [80,30,10], "Identity");

// KMS Server Layer
block([0,0,20], [120,40,10], "FastAPI KMS");

// Wallet Layer
block([-60,-40,0], [80,30,10], "Wallet");
block([60,-40,0], [80,30,10], "Node");

// P2P Layer
block([0,0,-40], [140,50,10], "P2P Blockchain");
