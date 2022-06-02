// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import useMedia from 'use-media';

import * as THREE from '@lib/three.module.js';
import { OrbitControls } from '@lib/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from '@lib/CSS3DRenderer.js';
import { update, removeAll, Tween, Easing } from '@lib/tween.js';
import { ossSizeMap } from '@src/utils/constants';
import Button from '../Button';
interface LuckyBoxAnimationProps {
  selectedCards: Array<string>;
  images: Array<{
    image: string;
    name: string;
    nftTokenId: string;
    isVideo: boolean;
  }>;
  stopAnimation: Function;
  isMobile: boolean;
}
const LuckyBoxAnimation: React.FC<LuckyBoxAnimationProps> = (props) => {
  const intl = useIntl();
  const history = useHistory();

  const camera = useRef(null);
  const scene = useRef(null);
  const renderer = useRef(null);
  const group = useRef(null);
  const controls = useRef(null);
  const objects = useRef({ current: [] });
  const targets = useRef({ current: { sphere: [], grid: [] } });

  // 停止动画
  const [stop, setStop] = useState(false);

  const translateXMap = {
    mobile: {
      1: {
        0: 0,
      },
      3: {
        0: -250,
        1: 0,
        2: 250,
      },
      5: {
        0: -500,
        1: -250,
        2: 0,
        3: 250,
        4: 500,
      },
    },
    pc: {
      1: {
        0: 0,
      },
      3: {
        0: -450,
        1: 0,
        2: 450,
      },
      5: {
        0: -900,
        1: -450,
        2: 0,
        3: 450,
        4: 900,
      },
    },
  };

  const generateElement = (imageElement) => {
    const inner = document.createElement('div');
    inner.style.width = '100px';
    inner.style.height = '100px';
    inner.style.display = 'flex';
    inner.style.justifyContent = 'center';
    inner.style.alignItems = 'center';
    inner.style.cursor = 'pointer';
    inner.dataset.key = `${imageElement.nftTokenId}-${imageElement.nftContractAddress}`;

    if (imageElement.isVideo) {
      const video = document.createElement('video');
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      video.style.position = 'relative';
      video.style.top = '50%';
      video.style.left = '50%';
      video.style.transform = 'translate(-50%, -50%)';
      video.src = imageElement.image;
      video.poster = `${imageElement.image}?x-oss-process=video/snapshot,t_7000,f_jpg,w_200,m_fast`;
      inner.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      img.style.position = 'relative';
      img.style.top = '50%';
      img.style.left = '50%';
      img.style.transform = 'translate(-50%, -50%)';
      img.src = `${imageElement.image}${ossSizeMap[100]}`;
      inner.appendChild(img);
    }
    inner.onclick = () => {
      console.debug('imageElement', imageElement);
      if (imageElement.boxContractAddress && imageElement.boxTokenId) {
        history.push(
          `/card-detail/${imageElement.nftContractAddress}/${imageElement.boxContractAddress}/${imageElement.nftTokenId}/${imageElement.boxContractAddress}/${imageElement.boxTokenId}`,
        );
      } else {
        history.push(
          `/card-detail/${imageElement.nftContractAddress}/${imageElement.ownerAddress}/${imageElement.nftTokenId}`,
        );
      }
    };
    const object = new CSS3DObject(inner);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    return object;
  };

  const initThree = () => {
    const container = document.getElementById('container');
    camera.current = new THREE.PerspectiveCamera(
      props.isMobile ? 120 : 90,
      window.innerWidth / window.innerHeight,
      1,
      5000,
    );
    window.camera = camera.current;
    camera.current.position.z = 1600;

    scene.current = new THREE.Scene();

    renderer.current = new CSS3DRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.current.domElement);

    group.current = new THREE.Group();
    addElementToGroup();

    scene.current.add(group.current);
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);

    window.control = controls.current;

    controls.current.enbaled = false;
    controls.current.enableRotate = false;
    controls.current.enableZoom = false;
    controls.current.enablePan = false;
    controls.current.autoRotate = false;
    controls.current.enableDamping = false;
    controls.current.enableRotateY = false;
  };

  const addElementToGroup = () => {
    group.current.clear();
    scene.current.remove(group.current);
    for (var i = 0; i < props.images.length; i++) {
      var object = generateElement(props.images[i], props.images.length, i);
      group.current.add(object);
      scene.current.add(object);
      objects.current.push(object);
    }

    // 排队
    for (var i = 0; i < objects.current.length; i++) {
      var obj = new THREE.Object3D();
      obj.position.x = (i % 5) * 400 - 800;
      obj.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
      obj.position.z = Math.floor(i / 25) * 1000 - 2000;
      targets.current.grid.push(obj);
    }

    // 地球
    var vector = new THREE.Vector3();
    for (var i = 0, l = objects.current.length; i < l; i++) {
      var phi = Math.acos(-1 + (2 * i) / l);
      var theta = Math.sqrt(l * Math.PI) * phi;
      var obj = new THREE.Object3D();
      obj.position.x = 1000 * Math.cos(theta) * Math.sin(phi);
      obj.position.y = 1000 * Math.sin(theta) * Math.sin(phi);
      obj.position.z = 1000 * Math.cos(phi);
      vector.copy(obj.position).multiplyScalar(2);
      obj.lookAt(vector);
      targets.current.sphere.push(obj);
    }
    scene.current.add(group.current);
  };

  const transform = (targetsData, duration) => {
    removeAll();
    update();
    for (var i = 0; i < objects.current.length; i++) {
      var object = objects.current[i];
      var target = targetsData[i];

      new Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration,
        )
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration,
        )
        .easing(Easing.Exponential.InOut)
        .start();
    }

    new Tween(this).to({}, duration).onUpdate(render).start();
  };

  const success = (targetsData, selectedCards, duration) => {
    console.debug('selectedCards', selectedCards);
    let idx = 0;
    for (var i = 0; i < objects.current.length; i++) {
      var object = objects.current[i];
      var target = targetsData[i];
      if (i > 0 && i % 10 === 0 && idx < selectedCards.length) {
        object.element.style.width = '400px';
        object.element.style.height = '400px';
        object.element.innerHTML = `<img src=${selectedCards[idx].imageUrl}${
          props.isMobile ? ossSizeMap[200] : ossSizeMap[312]
        } style="max-width: 100%; max-height: 100%; position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%);">`;

        const position = props.isMobile
          ? {
              x: 0,
              y: translateXMap[props.isMobile ? 'mobile' : 'pc'][selectedCards.length][idx],
              z: 1000,
            }
          : {
              x: translateXMap[props.isMobile ? 'mobile' : 'pc'][selectedCards.length][idx],
              y: 0,
              z: 1000,
            };

        new Tween(object.position)
          .to(position, Math.random() * duration + duration)
          .easing(Easing.Exponential.InOut)
          .start();

        new Tween(object.rotation)
          .to({ x: 0, y: 0, z: 0 }, Math.random() * duration + duration)
          .easing(Easing.Exponential.InOut)
          .start();

        idx++;
      } else {
        new Tween(object.position)
          .to(
            {
              x: 100000 * Math.random(),
              y: 100000 * Math.random(),
              z: -1000000 * Math.random(),
            },
            Math.random() * duration + duration,
          )
          .easing(Easing.Exponential.InOut)
          .start();

        new Tween(object.rotation)
          .to(
            { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
            Math.random() * duration + duration,
          )
          .easing(Easing.Exponential.InOut)
          .start();
      }
    }

    new Tween(this).to({}, duration).onUpdate(render).start();

    controls.current.reset();

    document.getElementById('button').style.display = 'flex';
  };

  const render = () => {
    controls.current.update();
    renderer.current.render(scene.current, camera.current);
  };

  const animate = () => {
    controls.current.autoRotateSpeed += 0.005;
    if (!stop) {
      requestAnimationFrame(animate);
    }
    controls.current.update();
    update();
    renderer.current.render(scene.current, camera.current);
  };

  useEffect(() => {
    objects.current = [];
    targets.current = { sphere: [], grid: [] };

    document.getElementById('button').style.display = 'none';

    initThree();
    animate();

    transform(targets.current.grid, 2000);

    setTimeout(() => {
      transform(targets.current.sphere, 2000);
    }, 2500);

    setTimeout(() => {
      controls.current.autoRotate = true;
      animate();
    }, 4500);
  }, []);

  useEffect(() => {
    if (props.selectedCards && props.selectedCards.length > 0) {
      setTimeout(() => {
        console.debug('抽中动画', props.selectedCards);
        controls.current.autoRotate = false;
        // 开启旋转
        camera.current.position.z = 1000;
        controls.current.enableRotate = true;
        setStop();
        success(targets.current.sphere, props.selectedCards, 2000);
      }, 1000);
    }
  }, [props.selectedCards]);

  return (
    <StyledContainer id="container">
      <StyledButton id="button">
        <Button
          onClick={() => {
            props.stopAnimation();
          }}
          size={'md'}
          variant="primary"
          text={intl.formatMessage({ id: 'common.button.ok' })}
        />
      </StyledButton>
    </StyledContainer>
  );
};
const StyledButton = styled.div`
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 13;
  @media (max-width: 600px) {
    height: 20%;
  }
`;

const StyledContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 11;
  top: 0;
  left: 0;

  img {
    box-shadow: 0px 0px 20px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    cursor: default;
  }

  img:hover {
    box-shadow: 0px 0px 20px rgba(0, 255, 255, 0.75);
    border: 1px solid rgba(127, 255, 255, 0.75);
  }
`;

export default LuckyBoxAnimation;
