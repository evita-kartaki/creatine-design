import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ScrollControls, useScroll, Scroll, Environment, Float } from '@react-three/drei';

function SodaModel({ url, position, scale }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} />;
}

function Composition({ isMobile }) {
  const scroll = useScroll();
  const group = useRef();

  // mobile = όπως το έχεις τώρα
  // desktop = λίγο μεγαλύτερα και με μεγαλύτερες αποστάσεις
  const settings = isMobile
    ? {
        moveY: 70,
        scale: 32,
        positions: [
          [5, 0, 0],
          [3, -35, 0],
          [2, -70, 0],
        ],
      }
    : {
        moveY: 82,
        scale: 40,
        positions: [
          [6.5, 0, 0],
          [4.5, -41, 0],
          [3.5, -82, 0],
        ],
      };

  useFrame(() => {
    const offset = scroll.offset;

    if (!group.current) return;

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      offset * settings.moveY,
      0.1
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      offset * Math.PI * 8,
      0.1
    );

    if (offset < 0.3) {
      document.body.style.backgroundColor = '#d4f1d6';
    } else if (offset < 0.6) {
      document.body.style.backgroundColor = '#FADADD';
    } else {
      document.body.style.backgroundColor = '#D4E1F1';
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <SodaModel url="/soda1.glb" position={settings.positions[0]} scale={settings.scale} />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <SodaModel url="/soda2.glb" position={settings.positions[1]} scale={settings.scale} />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <SodaModel url="/soda3.glb" position={settings.positions[2]} scale={settings.scale} />
      </Float>
    </group>
  );
}

export default function Scene() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 20 : 22], fov: isMobile ? 35 : 32 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={2.5} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={3} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={2} />

        <Environment preset="lobby" intensity={1.2} />

        <ScrollControls pages={3} damping={0.25}>
          <Composition isMobile={isMobile} />

          <Scroll html>
            <div style={{ position: 'absolute', top: '25vh', left: '12vw', width: '80vw' }}>
              <h1 style={{ fontSize: '12vw', fontWeight: '900', color: '#60be76', margin: 0, lineHeight: 0.8 }}>
                GREEN
                <br />
                APPLE
              </h1>
              <p style={{ fontSize: '1.5vw', letterSpacing: '0.2em', color: '#60be76', fontWeight: 'bold' }}>
                PREMIUM SODA 330ML
              </p>
            </div>

            <div style={{ position: 'absolute', top: '125vh', left: '12vw', width: '80vw' }}>
              <h1 style={{ fontSize: '12vw', fontWeight: '900', color: '#9B2C2C', margin: 0, lineHeight: 0.8 }}>
                BLACK
                <br />
                CHERRY
              </h1>
              <p style={{ fontSize: '1.5vw', letterSpacing: '0.2em', color: '#9B2C2C', fontWeight: 'bold' }}>
                FRESH GARDEN PICKED
              </p>
            </div>

            <div style={{ position: 'absolute', top: '225vh', left: '12vw', width: '80vw' }}>
              <h1 style={{ fontSize: '12vw', fontWeight: '900', color: '#2D3E50', margin: 0, lineHeight: 0.8 }}>
                BLUE
                <br />
                BERRY
              </h1>
              <p style={{ fontSize: '1.5vw', letterSpacing: '0.2em', color: '#2D3E50', fontWeight: 'bold' }}>
                SPICY & REFRESHING
              </p>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}