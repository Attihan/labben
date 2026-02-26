import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'

export default function Controller(props: GroupProps) {
  const { scene } = useGLTF('/models/controller.glb')

  const cloned = useMemo(() => scene.clone(), [scene])

  return <primitive object={cloned} {...props} />
}

useGLTF.preload('/models/controller.glb')