import "./FischerPrice3DModel.scss";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import MidiFile from "../model/MidiFile";
import { IMusicBoxProfile } from "../model/IMusicBoxProfile";

export interface IFischerPrice3DModelProps {
  midiFile: MidiFile;

  /**
   * Profile of the music box for which to generate SVG.
   */
  musicBoxProfile: IMusicBoxProfile;
}

export default class FischerPrice3DModel extends React.Component<IFischerPrice3DModelProps> {
  private divMountRef: HTMLDivElement | null = null;

  componentDidMount() {
    // === THREE.JS CODE START ===
    const w = 400;
    const h = 400;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    var noteMaterial = new THREE.MeshToonMaterial({ color: 0x2dc4b8 });

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    this.divMountRef?.appendChild(renderer.domElement);

    var light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.castShadow = true;
    //light1.target = baseModel;

    scene.add(light1);

    camera.position.z = 100;
    camera.position.y = 50;
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);

    const modelLoader = new GLTFLoader();
    let baseModel: THREE.Group;
    modelLoader.load("./assets/fischer-price-template.gltf", (gltf) => {
      baseModel = gltf.scene;
      scene.add(baseModel);

      baseModel.traverse((o) => {
        console.log(o.name);
        if (o instanceof THREE.Mesh) {
          o.material = noteMaterial;
        }
      });
    });

    this.addNotes(scene);

    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    };

    animate();
    // === THREE.JS EXAMPLE CODE END ===
  }

  private addNotes(scene: THREE.Scene) {
    // This music box's record format has 11 tracks and 12 rings.
    // Each track is used for two notes per half-track
    // Total of 22 notes can be accomodated in the track
    // TODO find out if all tracks are playable
    const numSubTracks = 22;

    // Measurements
    // Distance between tracks: 2.78 mm
    const distTracks = 2.78;

    // Ring width (for 10 rings except for first and last): 0.46
    const ringWidth = 0.5;

    // The distance of the centerline of the first track from the center of disc
    const firstTrackRadius = 27.27 + distTracks / 2;

    const subTrackWidth = distTracks / 2 - ringWidth / 2;
    const subTrackOffset = subTrackWidth / 2;

    const noteHeight = 2.4;
    const noteWidth = subTrackWidth / 2;
    const baseHeight = 1.2;

    // TODO replace this with MIDI file
    // Let's assume the notes are already translated to track/angle (in radians)
    var notesByTrack: Record<number, number[]> = {};
    const PI = 3.14159;
    const DEG2RAD = (2 * PI) / 360;
    for (let i = 0; i < numSubTracks; i++) {
      notesByTrack[i] = [i * 2 * DEG2RAD, (i * 2 + 90) * DEG2RAD];
    }

    var noteMaterial = new THREE.MeshToonMaterial({ color: 0xaaaaaa });

    for (let k in notesByTrack) {
      // Even subtracks are next to start of track
      // Odd subtracks are next to end of track
      let r;
      const subTrackNum = Number(k);
      const trackNum = Math.floor(subTrackNum / 2);
      const trackRadius = trackNum * distTracks + firstTrackRadius;
      if (subTrackNum % 2 === 0) {
        // Even subtracks are towards inner side of track
        r = trackRadius - subTrackOffset;
      } else {
        // Odd subtracks are towards outer side of track
        r = trackRadius + subTrackOffset;
      }

      for (let angle of notesByTrack[k]) {
        // Convert from polar to cartesian
        // The disc turns clockwise in the music box record player
        // THREEJS uses a right handed coordinate system
        const x = r * Math.cos(angle);
        const z = -r * Math.sin(angle);
        const y = baseHeight + noteHeight / 2;
        const noteGeom = new THREE.BoxGeometry(
          subTrackWidth,
          noteHeight,
          noteWidth
        );
        const noteMesh = new THREE.Mesh(noteGeom, noteMaterial);
        noteMesh.position.copy(new THREE.Vector3(x, y, z));
        noteMesh.rotation.y = angle;
        scene.add(noteMesh);
      }
    }
  }

  render() {
    return (
      <div
        ref={(mount) => {
          this.divMountRef = mount;
        }}
        className="fischer-price-3d-view"
      >
        TODO: Awesome 3D model here
      </div>
    );
  }
}
