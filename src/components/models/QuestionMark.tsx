import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'

export default function QuestionMark(props: GroupProps) {
  const { scene } = useGLTF('/models/QuestionMark.glb')

  const cloned = useMemo(() => scene.clone(), [scene])

  return <primitive object={cloned} {...props} />
}
    
useGLTF.preload('/models/QuestionMark.glb')