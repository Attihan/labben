import { useMemo, useState } from 'react'
import { useBox } from '@react-three/cannon'
import { Center, Html, useGLTF } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

type ClickableModelProps = {
  position: [number, number, number]
  href?: string
  glbPath: string
  args?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
  tune?: [number, number]
  tooltip?: string
  tooltipPosition?: [number, number, number]
}

function ClickableModel({
  position,
  href,
  glbPath,
  args = [1, 1, 1],
  scale = 1,
  rotation = [0, 0, 0],
  tune = [0.2, 0],
  tooltip,
  tooltipPosition = [0, 0, 0],
}: ClickableModelProps) {
  const { scene } = useGLTF(glbPath)
  const [hovered, setHovered] = useState(false)

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    const [roughness, metalness] = tune

    cloned.traverse((object: THREE.Object3D) => {
      if (!('isMesh' in object) || !object.isMesh) {
        return
      }

      const mesh = object as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = false

      const material = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
      const tuneMaterial = (meshMaterial: THREE.MeshStandardMaterial) => {
        if (typeof meshMaterial.roughness === 'number') {
          meshMaterial.roughness = roughness
        }
        if (typeof meshMaterial.metalness === 'number') {
          meshMaterial.metalness = metalness
        }
        meshMaterial.needsUpdate = true
      }

      if (Array.isArray(material)) {
        material.forEach((meshMaterial) => {
          if (meshMaterial) {
            tuneMaterial(meshMaterial)
          }
        })
        return
      }

      if (material) {
        tuneMaterial(material)
      }
    })

    return cloned
  }, [scene, tune])

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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (href) {
      window.location.href = href
    }
  }

  return (
    <group
      ref={ref as never}
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
        <primitive object={model} scale={0.7 * scale} rotation={rotation} />
      </Center>

      {hovered && tooltip && (
        <Html position={tooltipPosition} center>
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

export default ClickableModel
