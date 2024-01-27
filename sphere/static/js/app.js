// sphere/static/app.js
class Billboard {
    constructor(data, scene) {
        this.id = data.id;
        this.content = data.content;
        this.x_position = data.x_position;
        this.z_position = data.z_position;
        this.scene = scene;
        this.textMesh = null;
        this.planeMesh = null;
        this.createMesh();
    }

    createMesh() {
        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker.typeface.json', (font) => {
            const textGeometry = new THREE.TextGeometry(this.content, {
                font: font,
                size: 5,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: false
            });

            const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
            this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
            this.textMesh.position.set(this.x_position, 1, this.z_position);
            this.scene.add(this.textMesh);

            const planeGeometry = new THREE.PlaneGeometry(10, 5);
            const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            this.planeMesh.position.set(this.x_position, 0, this.z_position);
            this.planeMesh.rotation.y = Math.PI / 2;
            this.scene.add(this.planeMesh);
        });
    }

    updateContent(newData) {
        this.content = newData.content;
        this.x_position = newData.x_position;
        this.z_position = newData.z_position;

        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker.typeface.json', (font) => {
            const newTextGeometry = new THREE.TextGeometry(this.content, {
                font: font,
                size: 5,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: false
            });

                // Dispose old geometry after creating the new one
            if (this.textMesh.geometry) {
                this.textMesh.geometry.dispose();
            }
    
//                this.textMesh.geometry.dispose(); // Dispose of the old geometry
            this.textMesh.geometry = newTextGeometry;
            this.textMesh.position.set(this.x_position, 1, this.z_position);
        });

        // Update plane mesh position
        if (this.planeMesh) {
            this.planeMesh.position.set(this.x_position, 0, this.z_position);
        }
    }
}




const billboards = {};

function pollServer(scene, billboards) {
    fetch('/api/get-billboard-data')
        .then(res => res.json())
        .then(data => {
            data.forEach(billboardData => {
                if (billboards[billboardData.id]) {
                    // Update existing billboard
                    billboards[billboardData.id].updateContent(billboardData);
                } else {
                    // Create new billboard
                    billboards[billboardData.id] = new Billboard(billboardData, scene);
                }
            });
            setTimeout(() => pollServer(scene, billboards), 500);
        })
        .catch(err => {
            console.error(err);
            setTimeout(() => pollServer(scene, billboards), 500);  
        });
}


function fetchInitialBillboardData(scene) {
    fetch('/api/get-billboard-data')
        .then(response => response.json())
        .then(data => {
            const billboards = {};
            data.forEach(billboardData => {
                billboards[billboardData.id] = new Billboard(billboardData, scene);
            });

            // Start polling for billboard updates after the initial data is loaded
            pollServer(scene, billboards);
        })
        .catch(err => console.error('Error fetching initial billboard data:', err));
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('glCanvas')});
renderer.setSize(window.innerWidth, window.innerHeight);

// Ambient Light - adds diffuse light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light - simulates sunlight
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Materials
var material1 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
var material2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

// Cube (replaces the red sphere)
var geometry1 = new THREE.BoxGeometry(1, 1, 1);
var cube = new THREE.Mesh(geometry1, material1);
scene.add(cube);

// Green Sphere
var geometry2 = new THREE.SphereGeometry(0.5, 32, 32);
var sphere = new THREE.Mesh(geometry2, material2);
scene.add(sphere);

camera.position.z = 19;


// Function to generate a random number within a range
function randomInRange(from, to) {
    return Math.random() * (to - from) + from;
}


// Sand-colored Plane
var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xc2b280 }); // Sand color
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.position.y = -5; // 5 units down
scene.add(plane);

// Sky Plane
var skyGeometry = new THREE.PlaneGeometry(1000, 1000);
var skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.DoubleSide }); // Sky blue color
var sky = new THREE.Mesh(skyGeometry, skyMaterial);
sky.scale.set(1000, 1000, 1000); // Scale up the sky plane to ensure it covers the entire view
//sky.rotation.z = -Math.PI / 4; // Rotate the plane to be horizontal
sky.rotation.x = Math.PI / 4 // Rotate the plane to be horizontal
sky.position.y = 100; // High above
scene.add(sky);


// Trees
var treeGeometry = new THREE.ConeGeometry(0.5, 1, 32); // Cone geometry for trees
var treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Dark green color

for (let i = 0; i < 400; i++) {
    var tree = new THREE.Mesh(treeGeometry, treeMaterial);
    tree.position.set(randomInRange(-50, 50), -5, randomInRange(-50, 50)); // Random position within specified range
//    tree.rotation.x = Math.PI / 2; // Rotate to point upwards
    scene.add(tree);
}


var cameraVelocity = { x: 0, y: 0, z: 0 };
var cameraRotationSpeed = { x: 0, y: 0, z: 0 };
var acceleration = 0.02;
var rotationAcceleration = 0.001;
var maxSpeed = 0.2;
var maxRotationSpeed = 0.01;

var animate = function () {
    requestAnimationFrame(animate);

    // Rotate Cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;


    // Update camera position and rotation
    camera.position.x += cameraVelocity.x;
    camera.position.y += cameraVelocity.y;
    camera.position.z += cameraVelocity.z;

    camera.rotation.x += cameraRotationSpeed.x;
    camera.rotation.y += cameraRotationSpeed.y;
    camera.rotation.z += cameraRotationSpeed.z;



    // Orbiting animation for the green sphere (horizontal plane)
    var time = Date.now() * 0.001;
    sphere.position.x = 3 * Math.cos(time);
    sphere.position.z = 3 * Math.sin(time); // Adjust z-position for horizontal orbit

    renderer.render(scene, camera);
};

// function moveCamera(dx, dy, dz) {
//     camera.position.x += dx;
//     camera.position.y += dy;
//     camera.position.z += dz;
// }

// function rotateCamera(rx, ry, rz) {
//     camera.rotation.x += rx;
//     camera.rotation.y += ry;
//     camera.rotation.z += rz;
// }




document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // Adjust velocity and rotation speed
    switch (keyCode) {
        case 87: // W key
            cameraVelocity.z = -maxSpeed; // Move forward
            break;
        case 83: // S key
            cameraVelocity.z = maxSpeed; // Move backward
            break;
        case 65: // A key
            cameraVelocity.x = -maxSpeed; // Move left
            break;
        case 68: // D key
            cameraVelocity.x = maxSpeed; // Move right
            break;
        case 37: // Left arrow key
            cameraRotationSpeed.y = -maxRotationSpeed; // Rotate left
            break;
        case 39: // Right arrow key
            cameraRotationSpeed.y = maxRotationSpeed; // Rotate right
            break;
        case 38: // Up arrow key
            cameraRotationSpeed.x = -maxRotationSpeed; // Rotate up
            break;
        case 40: // Down arrow key
            cameraRotationSpeed.x = maxRotationSpeed; // Rotate down
            break;
        // Add more cases if needed
    }
}

function onDocumentKeyUp(event) {
    var keyCode = event.which;
    // Reset velocity and rotation speed
    switch (keyCode) {
        case 87: // W key
        case 83: // S key
            cameraVelocity.z = 0;
            break;
        case 65: // A key
        case 68: // D key
            cameraVelocity.x = 0;
            break;
        case 37: // Left arrow key
        case 39: // Right arrow key
            cameraRotationSpeed.y = 0;
            break;
        case 38: // Up arrow key
        case 40: // Down arrow key
            cameraRotationSpeed.x = 0;
            break;
        // Add more cases if needed
    }
}


animate();
fetchInitialBillboardData(scene);


// Join the 'billboard_group' group  
// socket.addEventListener('open', () => {
//     socket.send(JSON.stringify({
//         type: 'group_join',
//         group: 'billboard_group' 
//     }));
//     });
    