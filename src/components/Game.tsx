import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GameHUD } from './GameHUD';

interface Bot {
  mesh: THREE.Mesh;
  health: number;
  velocity: THREE.Vector3;
  target: THREE.Vector3;
  updateTimer: number;
}

export const Game = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isDead, setIsDead] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e14);
    scene.fog = new THREE.Fog(0x0a0e14, 20, 100);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create voxel map
    const createMap = () => {
      const floorGeometry = new THREE.BoxGeometry(100, 1, 100);
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1f2e,
        roughness: 0.8 
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -0.5;
      floor.receiveShadow = true;
      scene.add(floor);

      // Add walls and obstacles
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a3f5f,
        roughness: 0.7 
      });

      // Outer walls
      const walls = [
        { pos: [0, 2.5, -50], size: [100, 5, 2] },
        { pos: [0, 2.5, 50], size: [100, 5, 2] },
        { pos: [-50, 2.5, 0], size: [2, 5, 100] },
        { pos: [50, 2.5, 0], size: [2, 5, 100] },
      ];

      walls.forEach(wall => {
        const geometry = new THREE.BoxGeometry(...wall.size as [number, number, number]);
        const mesh = new THREE.Mesh(geometry, wallMaterial);
        mesh.position.set(...wall.pos as [number, number, number]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      });

      // Random obstacles
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 3 + 2;
        const height = Math.random() * 8 + 4;
        const geometry = new THREE.BoxGeometry(size, height, size);
        const mesh = new THREE.Mesh(geometry, wallMaterial);
        mesh.position.set(
          (Math.random() - 0.5) * 80,
          height / 2,
          (Math.random() - 0.5) * 80
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }
    };

    createMap();

    // Player setup
    camera.position.set(0, 2, 5);
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveSpeed = 0.15;
    const keys: Record<string, boolean> = {};

    // Raycaster for shooting
    const raycaster = new THREE.Raycaster();
    const shootPoint = new THREE.Vector2(0, 0);

    // Bots
    const bots: Bot[] = [];
    const botGeometry = new THREE.BoxGeometry(1, 2, 1);
    const botMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });

    const spawnBot = () => {
      const mesh = new THREE.Mesh(botGeometry, botMaterial.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        1,
        (Math.random() - 0.5) * 80
      );
      mesh.castShadow = true;
      scene.add(mesh);

      bots.push({
        mesh,
        health: 100,
        velocity: new THREE.Vector3(),
        target: new THREE.Vector3(),
        updateTimer: 0
      });
    };

    // Spawn initial bots
    for (let i = 0; i < 8; i++) {
      spawnBot();
    }

    // Muzzle flash effect
    const createMuzzleFlash = () => {
      const flashLight = new THREE.PointLight(0x00ffff, 2, 10);
      flashLight.position.copy(camera.position);
      scene.add(flashLight);

      setTimeout(() => {
        scene.remove(flashLight);
      }, 50);
    };

    // Shoot function
    const shoot = () => {
      if (isDead) return;

      createMuzzleFlash();
      raycaster.setFromCamera(shootPoint, camera);
      
      const botMeshes = bots.map(b => b.mesh);
      const intersects = raycaster.intersectObjects(botMeshes);

      if (intersects.length > 0) {
        const hitBot = bots.find(b => b.mesh === intersects[0].object);
        if (hitBot) {
          hitBot.health -= 25;
          
          // Flash red on hit
          (hitBot.mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xff0000);
          setTimeout(() => {
            (hitBot.mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
          }, 100);

          if (hitBot.health <= 0) {
            scene.remove(hitBot.mesh);
            const index = bots.indexOf(hitBot);
            bots.splice(index, 1);
            setScore(prev => prev + 10);
            
            // Respawn new bot
            setTimeout(() => spawnBot(), 2000);
          }
        }
      }
    };

    // Bot AI
    const updateBots = (deltaTime: number) => {
      bots.forEach(bot => {
        bot.updateTimer += deltaTime;

        // Update target every 2 seconds
        if (bot.updateTimer > 2) {
          bot.updateTimer = 0;
          const playerPos = camera.position;
          const distance = bot.mesh.position.distanceTo(playerPos);

          if (distance < 30 && Math.random() > 0.3) {
            // Move towards player
            bot.target.copy(playerPos);
          } else {
            // Random movement
            bot.target.set(
              (Math.random() - 0.5) * 80,
              1,
              (Math.random() - 0.5) * 80
            );
          }
        }

        // Move towards target
        const direction = bot.target.clone().sub(bot.mesh.position);
        direction.y = 0;
        direction.normalize();
        bot.velocity.lerp(direction.multiplyScalar(0.05), 0.1);
        bot.mesh.position.add(bot.velocity);

        // Look at target
        bot.mesh.lookAt(bot.target);

        // Simple shooting at player
        const distanceToPlayer = bot.mesh.position.distanceTo(camera.position);
        if (distanceToPlayer < 20 && Math.random() < 0.01 && !isDead) {
          const botRay = new THREE.Raycaster(
            bot.mesh.position,
            camera.position.clone().sub(bot.mesh.position).normalize()
          );
          const hits = botRay.intersectObject(scene.children.find(c => c instanceof THREE.Mesh && c !== bot.mesh) as THREE.Mesh);
          
          if (hits.length === 0 || hits[0].distance > distanceToPlayer) {
            setHealth(prev => {
              const newHealth = Math.max(0, prev - 5);
              if (newHealth === 0) {
                setIsDead(true);
                setTimeout(() => {
                  setHealth(100);
                  setIsDead(false);
                  camera.position.set(0, 2, 5);
                }, 3000);
              }
              return newHealth;
            });
          }
        }
      });
    };

    // Input handlers
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;

      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);
      euler.y -= e.movementX * 0.002;
      euler.x -= e.movementY * 0.002;
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    const onClick = () => {
      if (!document.pointerLockElement && !isDead) {
        renderer.domElement.requestPointerLock();
      } else if (document.pointerLockElement) {
        shoot();
      }
    };

    const onPointerLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isDead) {
        // Player movement
        direction.set(0, 0, 0);
        if (keys['w']) direction.z += 1;
        if (keys['s']) direction.z -= 1;
        if (keys['a']) direction.x -= 1;
        if (keys['d']) direction.x += 1;
        direction.normalize();

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        velocity.set(0, 0, 0);
        velocity.add(forward.multiplyScalar(direction.z * moveSpeed));
        velocity.add(right.multiplyScalar(direction.x * moveSpeed));

        camera.position.add(velocity);

        // Keep player in bounds
        camera.position.x = Math.max(-48, Math.min(48, camera.position.x));
        camera.position.z = Math.max(-48, Math.min(48, camera.position.z));
      }

      updateBots(deltaTime);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isDead]);

  return (
    <>
      <div ref={containerRef} className="w-full h-screen" />
      <GameHUD health={health} score={score} isLocked={isLocked} isDead={isDead} />
    </>
  );
};

