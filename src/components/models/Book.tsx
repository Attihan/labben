import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'

export default function book(props: GroupProps) {
  const { scene } = useGLTF('/models/book.glb')

  const cloned = useMemo(() => scene.clone(), [scene])

  return <primitive object={cloned} {...props} />
}

useGLTF.preload('/models/book.glb')