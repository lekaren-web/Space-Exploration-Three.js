
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth - 170, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
  const geometry = new THREE.SphereGeometry(35, 70, 80);
      // sun
      const material = new THREE.MeshStandardMaterial({
        color: "gold",
      });
      sun = new THREE.Mesh(geometry, material);
      sun.position.z = 1;
      sun.position.y = 1;
      sun.position.x = 0;
      sun.receiveShadow = true;
      sun.castShadow = true;
      sun.name = 'Sun'
      scene.add(sun);
      const light = new THREE.DirectionalLight("white", 1.3);
      light.position.set(1, 0, 6);

      scene.add(light);
      const light2 = new THREE.DirectionalLight("orange", 0.6);
      light2.position.set(1, 0, 3);

      scene.add(light2);
      const light3 = new THREE.DirectionalLight("brown", 0.6);
      light3.position.set(1, 0, 3);

      scene.add(light3);
  const mercgeo = new THREE.SphereGeometry(6, 60, 100);
      const mercmat = new THREE.MeshStandardMaterial({
        color: "tan",
      });
  merc = new THREE.Mesh(mercgeo, mercmat);
  merc.rotation.x = 9;
  merc.position.y = 50;
  merc.position.x = 50;
  merc.rotation.y = 8;
  merc.rotation.set(9, 3, 3);
  merc.receiveShadow = true;
  merc.castShadow = true;
  merc.name = 'Mecury'
  scene.add(merc);

  //venus
  const vengeo = new THREE.SphereGeometry(8, 60, 100);

  const venmat = new THREE.MeshStandardMaterial({
    color: "orange",
  });

  ven = new THREE.Mesh(vengeo, venmat);
  ven.rotation.x = 9;
  ven.position.y = 70;
  ven.position.x = 70;
  ven.rotation.y = 8;
  ven.position.z = 1;
  ven.rotation.set(9, 3, 3);
  ven.receiveShadow = true;
  ven.castShadow = true;
  ven.name= 'Venus'
  scene.add(ven);
  const earthgeo = new THREE.SphereGeometry(7, 60, 100);

  const earthmat = new THREE.MeshStandardMaterial({
    color: "tan",
  });

  earth = new THREE.Mesh(earthgeo, earthmat);
  earth.rotation.x = 9;
  earth.position.y = -80;
  earth.position.x = 80;
  earth.rotation.y = 8;
  earth.position.z = 1;
  earth.rotation.set(9, 3, 3);
  earth.receiveShadow = true;
  earth.castShadow = true;
  earth.name = 'Earth'
  scene.add(earth);
  //earthLayer2
  const earthgeo2 = new THREE.SphereGeometry(7, 60, 100);

  const earthmat2 = new THREE.MeshStandardMaterial({
    color: "blue",
  });

  earth2 = new THREE.Mesh(earthgeo2, earthmat2);
  earth2.rotation.x = 9;
  earth2.position.y = -80;
  earth2.position.x = 80;
  earth2.position.z = 1;
  earth2.rotation.y = 8;
  earth2.rotation.set(9, 3, 3);
  earth2.receiveShadow = true;
  earth2.castShadow = true;

  scene.add(earth2);
  //mars
  const marsgeo = new THREE.SphereGeometry(8, 60, 80);

  const marsmat = new THREE.MeshStandardMaterial({
    color: "red",
  });

  mars = new THREE.Mesh(marsgeo, marsmat);
  mars.rotation.x = 9;
  mars.position.y = -150;
  mars.position.x = -50;
  mars.rotation.y = 8;
  mars.position.z = 1;
  mars.rotation.set(9, 3, 3);
  mars.receiveShadow = true;
  mars.castShadow = true;
  mars.name = 'Mars'
  scene.add(mars);
  //jupiter

  const jupgeo = new THREE.SphereGeometry(8, 50, 100);

  const jupmat = new THREE.MeshStandardMaterial({
    color: "brown",
  });

  jup = new THREE.Mesh(jupgeo, jupmat);
  jup.rotation.x = 9;
  jup.position.y = -190;
  jup.position.x = 100;
  jup.rotation.y = 8;
  jup.position.z = 1;
  jup.rotation.set(9, 3, 3);
  jup.receiveShadow = true;
  jup.castShadow = true;
  jup.name = 'Jupiter'
  scene.add(jup);
  //satturn
  const satgeo = new THREE.SphereGeometry(7, 60, 80);

  const satmat = new THREE.MeshStandardMaterial({
    color: "coral",
  });
  sat = new THREE.Mesh(satgeo, satmat);
  sat.rotation.x = 9;
  sat.position.y = -220;
  sat.position.x = 190;
  sat.rotation.y = 8;
  sat.position.z = 6;
  sat.rotation.set(9, 3, 3);
  sat.receiveShadow = true;
  sat.castShadow = true;
  sat.name = 'Saturn'
  scene.add(sat);
  //uranus
  const urangeo = new THREE.SphereGeometry(7, 60, 80);

  const uranmat = new THREE.MeshStandardMaterial({
    color: "teal",
  });
  uran = new THREE.Mesh(urangeo, uranmat);
  uran.rotation.x = 9;
  uran.position.y = 270;
  uran.position.x = 9;
  uran.rotation.y = 8;
  uran.position.z = 6;
  uran.rotation.set(9, 3, 3);
  uran.receiveShadow = true;
  uran.castShadow = true;
  uran.name = 'Uranus'
  scene.add(uran);
  //neptune
  const nepgeo = new THREE.SphereGeometry(8, 60, 80);

  const nepmat = new THREE.MeshStandardMaterial({
    color: "blue",
  });
  nep = new THREE.Mesh(nepgeo, nepmat);
  nep.rotation.x = 9;
  nep.position.y = 300;
  nep.position.x = 90;
  nep.rotation.y = 8;
  nep.position.z = 6;
  nep.rotation.set(9, 3, 3);
  nep.receiveShadow = true;
  nep.castShadow = true;
  nep.name = 'Neptune' 

  scene.add(nep);
  //pluto
  const plugeo = new THREE.SphereGeometry(3, 60, 80);

  const plumat = new THREE.MeshStandardMaterial({
    color: "beige",
  });
  plu = new THREE.Mesh(nepgeo, nepmat);
  plu.rotation.x = 9;
  plu.position.y = 340;
  plu.position.x = 10;
  plu.rotation.y = 8;
  plu.position.z = 6;
  plu.rotation.set(9, 3, 3);
  plu.receiveShadow = true;
  plu.castShadow = true;
  plu.name = 'Pluto'
  scene.add(plu);
  const animate = function () {
    requestAnimationFrame(animate);
    camera.rotation.z -= document.getElementById("speed").value / 450;
    earth2.rotation.y += 0.00000001;
    ven.rotation.x -= 0.000002;
    mars.rotation.y -= 0.000001;
    jup.rotation.y += 0.0000001;
    renderer.render(scene, camera);
  }; 
  this.tl = new TimelineMax({ paused: true }).delay(0.3);
  this.tl1 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl2 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl3 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl4 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl5 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl6 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl7 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl8 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl9 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl10 = new TimelineMax({ paused: true }).delay(0.3);
  this.tl11 = new TimelineMax({ paused: true }).delay(0.3);

  this.tl1.to(ven.position, 4, { x: 1 });
  this.tl2.to(sun.position, 4, { x: 1 });
  this.tl3.to(merc.position, 4, { x: 1 });
  this.tl4.to(earth.position, 4, { x: 1 });
  this.tl5.to(earth2.position, 4, { x: 1 });
  this.tl6.to(mars.position, 4, { x: 1 });
  this.tl7.to(jup.position, 4, { x: 1 });
  this.tl8.to(sat.position, 4, { x: 1 });
  this.tl9.to(uran.position, 4, { x: 1 });
  this.tl10.to(nep.position, 4, { x: 1 });
  this.tl11.to(plu.position, 4, { x: 1 });

  //align
  this.tl3.to(merc.position, 9, { y: 60 });
  this.tl1.to(ven.position, 9, { y: 80 });
  this.tl4.to(earth.position, 9, { y: 100 });
  this.tl5.to(earth2.position, 9, { y: 120 });
  this.tl6.to(mars.position, 9, { y: 140 });
  this.tl7.to(jup.position, 9, { y: 160 });
  this.tl8.to(sat.position, 9, { y: 180 });
  this.tl9.to(uran.position, 9, { y: 200 });
  this.tl10.to(nep.position, 9, { y: 220 });
  this.tl11.to(plu.position, 9, { y: 240 });

  //undo
  this.tl3.to(merc.position, 6, { y: 50 }); //
  this.tl1.to(ven.position, 6, { y: 70 }); //
  this.tl4.to(earth.position, 6, { y: -80 }); //
  this.tl5.to(earth2.position, 6, { y: -80 }); //
  this.tl6.to(mars.position, 6, { y: -150 }); //
  this.tl7.to(jup.position, 6, { y: -190 }); //
  this.tl8.to(sat.position, 6, { y: -220 }); //
  this.tl9.to(uran.position, 6, { y: 270 }); //
  this.tl10.to(nep.position, 6, { y: 300 }); //
  this.tl11.to(plu.position, 6, { y: 340 });

  this.tl1.to(ven.position, 6, { x: 70 }); //
  this.tl3.to(merc.position, 6, { x: 50 }); //
  this.tl4.to(earth.position, 6, { x: 80 }); //
  this.tl5.to(earth2.position, 6, { x: 80 }); //
  this.tl6.to(mars.position, 6, { x: -50 }); //
  this.tl7.to(jup.position, 6, { x: 100 }); //
  this.tl8.to(sat.position, 6, { x: 190 }); //
  this.tl9.to(uran.position, 6, { x: 9 }); //
  this.tl10.to(nep.position, 6, { x: 90 });
  this.tl11.to(plu.position, 6, { x: 10 });

  document.querySelector("button").addEventListener("click", () => {
    tl.play().restart();
    tl1.play().restart();
    tl2.play().restart();
    tl3.play().restart();
    tl4.play().restart();
    tl5.play().restart();
    tl6.play().restart();
    tl7.play().restart();
    tl8.play().restart();
    tl9.play().restart();
    tl10.play().restart();
    tl11.play().restart();
  });

  document.addEventListener("mousewheel", (event) => {
    camera.position.z += event.deltaY / 6;

  });

  animate();
