import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'

interface Preview3DProps {
  boothConfig: any;
  elements: any[];
}

const PPM = 100;

function Object3D({ el }: { el: any }) {
  const w = el.width / PPM;
  const d = el.height / PPM; // height in 2D is depth in 3D

  // Position the object correctly. Y is up in 3D, so we map Konva Y to 3D Z.
  // Wait, Threejs origin is 0,0,0. Let's make the scene aligned where the Booth bottom-left is 0,0, but let's just use exact coordinates.
  const x = el.x / PPM;
  const z = el.y / PPM;
  const rotY = -el.rotation * (Math.PI / 180);

  if (el.type === 'wall') {
    let color = '#dddddd';
    let transparent = false;
    let opacity = 1;

    if (el.material === 'Glass Walk') {
      color = '#88ccff';
      transparent = true;
      opacity = 0.4;
    } else if (el.material === 'Wood') {
      color = '#5C4033'; // Brown wood
    }

    const h = 2.5; // Standard wall height 2.5m
    return (
      <mesh position={[x, h / 2, z]} rotation={[0, rotY, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={transparent} opacity={opacity} />
      </mesh>
    )
  }

  // Assets mapping
  let h = 0.8; // default height
  let color = '#ffffff';

  const name = el.assetName?.toLowerCase() || '';

  if (name.includes('chair') && !name.includes('bar')) {
    h = 0.45; // seat height
    color = '#222222';
    return (
      <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
        {/* Seat */}
        <mesh position={[0, h, 0]}>
          <boxGeometry args={[w * 0.9, 0.05, d * 0.9]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, h + 0.4, -d * 0.4]}>
          <boxGeometry args={[w * 0.9, 0.4, 0.05]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs representation */}
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, h, 8]} />
          <meshStandardMaterial color={'#555555'} />
        </mesh>
      </group>
    )
  } else if (name.includes('bar_chair')) {
    h = 0.75; // higher seat
    color = '#ffcc00';
    return (
      <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
        <mesh position={[0, h, 0]}>
          <cylinderGeometry args={[w / 2, w / 2, 0.1, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, h, 8]} />
          <meshStandardMaterial color={'#888888'} />
        </mesh>
      </group>
    )
  } else if (name.includes('round_table')) {
    h = 0.75;
    color = '#eeeeee';
    return (
      <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
        <mesh position={[0, h, 0]}>
          <cylinderGeometry args={[w / 2, w / 2, 0.05, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, h, 16]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
      </group>
    )
  } else if (name.includes('infodesk')) {
    h = 1.0;
    color = '#3b82f6'; // blue theme info desk
    return (
      <group position={[x, h / 2, z]} rotation={[0, rotY, 0]}>
        <mesh>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Highlight counter top */}
        <mesh position={[0, h / 2 + 0.02, 0]}>
          <boxGeometry args={[w + 0.05, 0.02, d + 0.05]} />
          <meshStandardMaterial color={'#ffffff'} />
        </mesh>
      </group>
    )
  } else if (name.includes('table')) {
    h = 0.75;
    color = '#bb9977'; // wood table
    return (
      <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
        <mesh position={[0, h, 0]}>
          <boxGeometry args={[w, 0.05, d]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[w / 2 - 0.1, h / 2, d / 2 - 0.1]}>
          <boxGeometry args={[0.05, h, 0.05]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
        <mesh position={[-w / 2 + 0.1, h / 2, d / 2 - 0.1]}>
          <boxGeometry args={[0.05, h, 0.05]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
        <mesh position={[w / 2 - 0.1, h / 2, -d / 2 + 0.1]}>
          <boxGeometry args={[0.05, h, 0.05]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
        <mesh position={[-w / 2 + 0.1, h / 2, -d / 2 + 0.1]}>
          <boxGeometry args={[0.05, h, 0.05]} />
          <meshStandardMaterial color={'#111111'} />
        </mesh>
      </group>
    )
  } else if (name.includes('plant')) {
    return (
      <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
        {/* Pot */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[w * 0.4, w * 0.3, 0.4, 16]} />
          <meshStandardMaterial color={'#aa5544'} />
        </mesh>
        {/* Bush */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[w * 0.6, 16, 16]} />
          <meshStandardMaterial color={'#228b22'} />
        </mesh>
      </group>
    )
  }

  // Generic fallback Box
  return (
    <mesh position={[x, h / 2, z]} rotation={[0, rotY, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={'#dddddd'} />
    </mesh>
  )
}

function BoothStructure({ config }: { config: any }) {
  if (!config) return null;
  const bw = config.width;
  const bd = config.depth; // Depth is Z axis
  const walls = config.walls;
  const h = 2.5;
  const wallThick = 0.1;

  // We place the booth such that (0,0) matches Konva's top-left, 
  // so the booth center would naturally be (bw/2, 0, bd/2).

  return (
    <group>
      {/* Floor Floor bounds */}
      <mesh position={[bw / 2, -0.01, bd / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[bw, bd]} />
        <meshStandardMaterial color="#334455" />
      </mesh>

      {/* Structural Walls passed from setup */}
      {/* North Wall (Z=0) */}
      {walls.north && (
        <mesh position={[bw / 2, h / 2, 0]}>
          <boxGeometry args={[bw, h, wallThick]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      )}
      {/* South Wall (Z=bd) */}
      {walls.south && (
        <mesh position={[bw / 2, h / 2, bd]}>
          <boxGeometry args={[bw, h, wallThick]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      )}
      {/* West Wall (X=0) */}
      {walls.west && (
        <mesh position={[0, h / 2, bd / 2]}>
          <boxGeometry args={[wallThick, h, bd]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      )}
      {/* East Wall (X=bw) */}
      {walls.east && (
        <mesh position={[bw, h / 2, bd / 2]}>
          <boxGeometry args={[wallThick, h, bd]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      )}
    </group>
  )
}

export default function Preview3D({ boothConfig, elements }: Preview3DProps) {
  // Calculate center to aim camera
  const centerX = boothConfig ? boothConfig.width / 2 : 0;
  const centerZ = boothConfig ? boothConfig.depth / 2 : 0;

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#121415' }}>
      <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-white text-xs">Loading 3D Engine...</div>}>
        <Canvas camera={{ position: [centerX, 5, centerZ + 8], fov: 45 }}>
          <color attach="background" args={['#121415']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />

          <Grid
            infiniteGrid
            fadeDistance={30}
            sectionColor="#444444"
            cellColor="#222222"
            position={[0, -0.02, 0]}
          />

          {/* Booth Context */}
          <group position={[0, 0, 0]}>
            <BoothStructure config={boothConfig} />
            {/* Draggable Layout Elements */}
            {elements.map((el) => (
              <Object3D key={el.id} el={el} />
            ))}
          </group>

          <OrbitControls target={[centerX, 1, centerZ]} makeDefault />
        </Canvas>
      </React.Suspense>
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] uppercase shadow-lg">
          Left Click: Rotate • Right Click: Pan • Scroll: Zoom
        </div>
      </div>
    </div>
  )
}
