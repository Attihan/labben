import { useEffect, useMemo, useState, Suspense } from 'react'
import '../styles/Home.css'
import Navbar from '../components/layout/Navbar'
import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import * as THREE from 'three'


// Tweaks the floor
type PlaneProps = { position?: [number, number, number] }

function Floor({ position = [0, 0, 0] }: PlaneProps) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
    material: {
      friction: 1.4,
      restitution: 0,
    },
  }))

  // floor color
  const floorColor =  '#3F4D3F' //'#e1ec9e'


  // tweak shadows
  return (
    <group>
      {/* Base floor (no shadows) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={floorColor} roughness={1} metalness={0} />
      </mesh>

      {/* Shadow catcher (only shadows) */}
      <mesh
        ref={ref as any}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], position[1] + 0.001, position[2]]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.50} />
      </mesh>
    </group>
  )
}

//  frame for clickable models
type ClickableModelProps = {
  position: [number, number, number]
  href?: string
  glbPath: string
  args?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
  tune?: [number, number]
  tooltip?: string
}

// takes in arguments, creates a physics box, and handles click interactions for the model
function ClickableModel({
  position,
  href,
  glbPath,
  args = [1, 1, 1],
  scale = 1,
  rotation = [0, 0, 0],
  tune = [0.2, 0.0],
  tooltip,
}: ClickableModelProps) {
  const { scene } = useGLTF(glbPath)
  const [hovered, setHovered] = useState(false)

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    const [roughness, metalness] = tune

    cloned.traverse((obj: any) => {
      if (!obj.isMesh) return
      obj.castShadow = true
      obj.receiveShadow = false

      // Tweaks the material roughness and metall of all the GBL models
      const mat = obj.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
      const tuneMaterial = (m: THREE.MeshStandardMaterial) => {
        if (typeof m.roughness === 'number') m.roughness = roughness
        if (typeof m.metalness === 'number') m.metalness = metalness
        m.needsUpdate = true
      }
      if (Array.isArray(mat)) mat.forEach((m) => m && tuneMaterial(m))
      else if (mat) tuneMaterial(mat)
    })

    return cloned
  }, [scene, tune])

  // the physics for the model
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args,
    linearDamping: 0.4,
    angularDamping: 0.95,
    allowSleep: true,
    sleepSpeedLimit: 0.05,
    sleepTimeLimit: 1,
    material: {
      friction: 1.2,
      restitution: 0,
    },
  }))

  // handles redirects when clicking on the model
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (href) window.location.href = href
  }

  // the model itself, with click interactions
  return (
    <group
      ref={ref as any}
      onClick={handleClick} 
      onPointerOver={() => {
        document.body.style.cursor = href ? 'pointer' : 'default'
        setHovered(true)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
        setHovered(false)
      }}
    
    >
      <Center>
        <primitive
          object={model} // the model itself
          scale={0.7 * scale} // the scale of model 
          rotation={rotation} // rotations
        />
      </Center>

      {hovered && tooltip && (    // if hovered, show tooltip above model
        <Html position={[0, 1.8, 0]} center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {tooltip}
          </div>
        </Html>
      )}
    </group>
  )
}

// --- Simple physics cube (no GLB), delete when replaced with actual models !!!
type ClickableCubeProps = {
  position: [number, number, number]
  href?: string
  args?: [number, number, number]
}

// cube physics
function ClickableCube({ position, href, args = [1, 1, 1] }: ClickableCubeProps) {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args,
    linearDamping: 0.9,
    angularDamping: 0.95,
    allowSleep: true,
    sleepSpeedLimit: 0.05,
    sleepTimeLimit: 1,
    material: {
      friction: 1.2,
      restitution: 0,
    },
  }))

// cube click handler
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (href) window.location.href = href
  }

  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref as any}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = href ? 'pointer' : 'default')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color="orange" roughness={0.7} metalness={0} />
    </mesh>
  )
}

function Home() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Welcome to Labben</h2>
        <p>
          I use this website as a way to express my learning, as well as a laboratory for learning about different plugins within
          Typescript/React.
        </p>
        <p>To continue exploring, click on the object below.</p>
      </div>

      <div id="canvas-container">
        <Canvas dpr={[1, 2]} shadows camera={{ position: [3, 8, 4], fov: 50 }}>
          <color attach="background" args={['#3F4D3F']} />

          {/* shadow */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[8, 12, 8]}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />

          <Suspense fallback={null}>
            <Physics
              broadphase="SAP"
              allowSleep
              iterations={12}
              defaultContactMaterial={{
                friction: 1.2,
                restitution: 0,
              }}e1ec9e
            >
              <Floor />

              <ClickableModel // game controller model
                position={[1, 10, -1]}
                href="/games"
                glbPath="/models/controller.glb"
                args={[1, 1, 1]}
                scale={1}
                rotation={[0, 17.5, 0]}
                tooltip="Games"
              />

              <ClickableModel // question mark model 
                position={[4, 5, -8]}
                href="/questions"
                glbPath="/models/QuestionMark.glb"
                rotation={[-0.5, 0, 0]}
                args={[1, 1.5, 1]}
                scale={5}
                tune ={[0.2, 0.0]}
                tooltip=''
              />

              <ClickableModel // pointer model
                position={[-4, 5,3]} 
                href='interactive'
                glbPath='/models/pointer.glb'
                args={[1, 1.5, 1]}
                rotation={[-0.7, 1.2, 0.3]}
                scale={1}
                tune={[0.0, 0.0]}
                tooltip='Interactive experiments'
              />

              <ClickableCube 
              position={[4, 7, -2]} 
              href="/animations" />

              <ClickableModel // book model
              position={[-2, 7, 1]} 
              href="/about"
              glbPath='/models/book.glb'
              args={[1, 1.5, 1]}
              rotation={[0, 2, 25]}
              scale={1}
              tune={[0.2, 0.0]}
              tooltip='What I have learned creating Labben'
              />
            </Physics>
          </Suspense>

          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} target={[0, 2, 0]} />
        </Canvas>
      </div>
    </>
  )
}

export default Home

useGLTF.preload('/models/controller.glb')
