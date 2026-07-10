"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

function Model({
  url,
  modelScale = 2.2,
  modelOffset = [0, 0, 0],
}: {
  url: string;
  modelScale?: number;
  modelOffset?: [number, number, number];
}) {
  const { scene, animations } = useGLTF(url);

  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

useEffect(() => {
  if (!scene || !groupRef.current) return;

  // clear previous model safely
  groupRef.current.clear();

  const model = scene;

  // reset transforms (IMPORTANT for carousel switching)
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);
  model.scale.set(1, 0.6, 1.5);

  // =========================
  // CENTER + SCALE
  // =========================
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(
    -center.x + modelOffset[0],
    -center.y + modelOffset[1],
    -center.z + modelOffset[2]
  );
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  model.scale.setScalar(modelScale / maxDim);

  groupRef.current.add(model);

  // =========================
  // ANIMATION FIX
  // =========================
  if (animations && animations.length > 0) {
    const idle = animations.find((a) => a.name === "WebsiteIDLE" || a.name === "MariIDLE");

    if (!idle) return;

    // IMPORTANT: stop previous mixer properly
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    mixerRef.current = new THREE.AnimationMixer(model);

    const action = mixerRef.current.clipAction(idle);

    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.timeScale = 1;
    action.play();
  }
}, [scene, animations]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return <group ref={groupRef} position={[0, 0, 0]} />;
}

export default function GuardianModel({
  url,
  modelScale,
  modelOffset,
}: {
  url: string;
  modelScale?: number;
  modelOffset?: [number, number, number];
}) {
  return (
    <div className="guardian-model-wrapper">
      <Canvas camera={{ position: [0, 0, 4], fov: 23 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 3, 3]} intensity={2} />

        <Suspense fallback={null}>
          <Model
            url={url}
            modelScale={modelScale}
            modelOffset={modelOffset}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}

          autoRotate
          autoRotateSpeed={1}

          enableRotate={true}
          rotateSpeed={0.8}

          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}