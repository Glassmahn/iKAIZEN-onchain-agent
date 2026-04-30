"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, Environment, Stars } from "@react-three/drei"
import * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 128, 128]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1}
        />
      </Sphere>
    </Float>
  )
}

function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.8, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
        wireframe
      />
    </Sphere>
  )
}

function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.5
    if (ring2Ref.current) ring2Ref.current.rotation.x = time * 0.3
    if (ring3Ref.current) ring3Ref.current.rotation.y = time * 0.4
  })

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 6, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} transparent opacity={0.4} />
      </mesh>
    </>
  )
}

function Particles() {
  const count = 500
  const particlesRef = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 3
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

function DataStreams() {
  const streamsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (streamsRef.current) {
      streamsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const streamCount = 8
  const streams = useMemo(() => {
    return Array.from({ length: streamCount }, (_, i) => {
      const angle = (i / streamCount) * Math.PI * 2
      return {
        position: [Math.cos(angle) * 3, 0, Math.sin(angle) * 3] as [number, number, number],
        rotation: [0, angle, 0] as [number, number, number],
      }
    })
  }, [])

  return (
    <group ref={streamsRef}>
      {streams.map((stream, i) => (
        <mesh key={i} position={stream.position} rotation={stream.rotation}>
          <cylinderGeometry args={[0.005, 0.005, 2, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#00d4ff" />
        
        <AnimatedSphere />
        <InnerCore />
        <OrbitalRings />
        <Particles />
        <DataStreams />
        
        <Stars radius={50} depth={50} count={2000} factor={2} saturation={0} fade speed={1} />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
