import { useEffect, useMemo, useState, Suspense } from 'react'
import '../styles/Home.css'
import Navbar from '../components/layout/Navbar'
import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import * as THREE from 'three'

// Tweaks the floor
type PlaneProps = { position?: [number, number, number] }

function Floor({ position = [0, 0, 0] }: PlaneProps) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
  }))

  // floor color
  const floorColor = '#e1ec9e'


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

//  a linkable gbl model, physics and position included
type ClickableModelProps = {
  position: [number, number, number]
  href?: string
  glbPath: string
  args?: [number, number, number]
  scale?: number
}

function ClickableModel({ position, href, glbPath, args = [1, 1, 1], scale = 1 }: ClickableModelProps) {
  const { scene } = useGLTF(glbPath)

  const model = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse((obj: any) => {
      if (!obj.isMesh) return
      obj.castShadow = true
      obj.receiveShadow = true

      // Tweaks the material roughness and metall of the GBL models
      const mat = obj.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
      const tune = (m: THREE.MeshStandardMaterial) => {
        if (typeof m.roughness === 'number') m.roughness = 0.2
        if (typeof m.metalness === 'number') m.metalness = 0.0
        m.needsUpdate = true
      }
      if (Array.isArray(mat)) mat.forEach((m) => m && tune(m))
      else if (mat) tune(mat)
    })

    return cloned
  }, [scene])

  // the physics for the model
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args,
    linearDamping: 0.5,
    angularDamping: 0.5,
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
      onPointerOver={() => (document.body.style.cursor = href ? 'pointer' : 'default')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    
    >
      <Center>
        <primitive
          object={model} // the model itself
          scale={0.7 * scale} // the scale of model 
          rotation={[0, 5, 0]} // rotation
        />
      </Center>
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
          <color attach="background" args={['#e1ec9e']} />

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
            <Physics>
              <Floor />

              <ClickableModel
                position={[1, 10, -1]}
                href="/games"
                glbPath="/models/controller.glb"
                args={[1, 1, 1]}
                scale={1}
              />

              <ClickableCube position={[5, 7, -2]} href="/animations" />
              <ClickableCube position={[-4, 9, 3]} href="/interactive"/>
              <ClickableCube position={[-2, 10, 1]} href="/about"/>
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