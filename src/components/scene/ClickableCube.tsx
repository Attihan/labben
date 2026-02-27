import { useBox } from '@react-three/cannon'
import { ThreeEvent } from '@react-three/fiber'

type ClickableCubeProps = {
  position: [number, number, number]
  href?: string
  args?: [number, number, number]
}

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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (href) {
      window.location.href = href
    }
  }

  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref as never}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = href ? 'pointer' : 'default'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color="orange" roughness={0.7} metalness={0} />
    </mesh>
  )
}

export default ClickableCube
