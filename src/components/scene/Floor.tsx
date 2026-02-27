import { usePlane } from '@react-three/cannon'

type FloorProps = {
  position?: [number, number, number]
}

function Floor({ position = [0, 0, 0] }: FloorProps) {
  // Physics plane for collisions
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position,
    material: {
      friction: 1.4,
      restitution: 0,
    },
  }))

  return (
    <group>
      {/* Visible floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#3F4D3F" roughness={1} metalness={0} />
      </mesh>

      {/* Shadow catcher */}
      <mesh
        ref={ref as never}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], position[1] + 0.001, position[2]]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  )
}

export default Floor
