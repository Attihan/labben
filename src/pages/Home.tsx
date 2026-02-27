import { Suspense } from 'react'
import '../styles/Home.css'
import Navbar from '../components/layout/Navbar'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import ClickableCube from '../components/scene/ClickableCube'
import ClickableModel from '../components/scene/ClickableModel'
import Floor from '../components/scene/Floor'

function Home() {
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

          {/* Scene lights */}
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

          {/* Scene content */}
          <Suspense fallback={null}>
            <Physics
              broadphase="SAP"
              allowSleep
              iterations={12}
              defaultContactMaterial={{
                friction: 1.2,
                restitution: 0,
              }}
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
                tooltipPosition={[0, 1.8, 0]}
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
                tooltipPosition={[0.6, 1.6, -0.4]}
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
              tooltipPosition={[0.5, 1.6, 0]}
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
